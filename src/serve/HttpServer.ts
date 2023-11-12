import { CommonOption, HttpServer, ServeHandler } from './common';
import { IncomingMessage, Server, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { Request, Headers } from 'undici';
import { URL } from 'node:url';

export class NodeHttpServer implements HttpServer {
  public finished: Promise<void>;
  private server: Server;

  public constructor(
    public handler: ServeHandler,
    public options: CommonOption
  ) {
    this.server = new Server(this._handleRequest.bind(this));
    this.finished = new Promise((resolve) => {
      this.server.once('close', () => resolve());
    });

    const onListen =
      options.onListen ||
      (({ hostname, port }) =>
        console.log(`Listening on http://${hostname}:${port}/`));

    this.server.once('listening', () => {
      const addr = this.server.address();
      if (!addr)
        return onListen({
          hostname: options.hostname ?? '',
          port: options.port ?? 0,
        });

      if (typeof addr === 'string') {
        const [hostname, port] = addr.split(':');
        return onListen({
          hostname,
          port: Number(port),
        });
      }

      onListen({
        hostname: addr.address ?? '',
        port: addr.port ?? 0,
      });
    });

    this.server.listen({
      port: options.port ?? 8000,
      host: options.hostname,
      signal: options.signal,
    });

    if (options.reusePort) {
      // TODO
    }
  }

  private async _handleRequest(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) {
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      headers.append(key, value as string);
    }

    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
    const bodyStream = ['GET', 'HEAD'].includes(req.method!)
      ? null
      : Readable.toWeb(req);
    const request = new Request(url, {
      method: req.method,
      keepalive: req.headers['keep-alive'] === 'true',
      headers,
      body: bodyStream,
      duplex: bodyStream !== null ? 'half' : undefined,
    });

    const response = await this.handler(request, {
      remoteAddr: {
        hostname: req.socket.remoteAddress ?? '',
        port: req.socket.remotePort ?? 0,
        transport: 'tcp',
      },
    });

    res.statusCode = response.status;

    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }

    if (response.body && !response.bodyUsed) {
      Readable.fromWeb(response.body).pipe(res);
    }
  }

  public ref(): void {
    this.server.ref();
  }

  public unref(): void {
    this.server.unref();
  }

  public async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((e) => {
        if (e) return reject(e);
        resolve();
      });
    });
  }

  public async [Symbol.asyncDispose](): Promise<void> {
    return await this.shutdown();
  }
}
