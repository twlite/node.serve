import { Awaitable } from '../common';
import type { Request, Response } from 'undici';

export interface NetAddr {
  transport: 'tcp' | 'udp';
  hostname: string;
  port: number;
}

export interface ServeHandlerInfo {
  remoteAddr: NetAddr;
}

/**
 * A handler for HTTP requests. Consumes a request and returns a response.
 *
 * If a handler throws, the server calling the handler will assume the impact of the error is isolated to the individual request. It will catch the error and if necessary will close the underlying connection.
 */
export type ServeHandler = (
  request: Request,
  info: ServeHandlerInfo
) => Awaitable<Response>;

/**
 * Options which can be set when calling `Node.serve`.
 */
export interface ServeOptions {
  /**
   * The port to listen on.
   * @default 8000
   */
  port?: number;
  /**
   * A literal IP address or host name that can be resolved to an IP address.
   *
   * **Note about `0.0.0.0`** While listening `0.0.0.0` works on all platforms,
   * the browsers on Windows don't work with the address `0.0.0.0`.
   * You should show the message like `server running on localhost:8080`
   * instead of `server running on 0.0.0.0:8080` if your program supports Windows.
   */
  hostname?: string;
  /**
   * An [AbortSignal](https://nodejs.org/api/globals.html#class-abortsignal) to close the server and all connections.
   */
  signal?: AbortSignal;
  /**
   * Sets `SO_REUSEPORT` on POSIX systems.
   */
  reusePort?: boolean;
  /**
   * The handler to invoke when route handlers throw an error.
   */
  onError?: (error: unknown) => Awaitable<Response>;
  /**
   * The callback which is called when the server starts listening.
   */
  onListen?: (params: { hostname: string; port: number }) => void;
}

/**
 * Additional options which are used when opening a TLS (HTTPS) server.
 */
export interface ServeTlsOptions extends ServeOptions {
  /**
   * Server private key in PEM format
   */
  cert: string;
  /**
   * Cert chain in PEM format
   */
  key: string;
}

export interface ServeInit {
  /**
   * The handler to invoke to process each incoming request.
   */
  handler: ServeHandler;
}

export interface HttpServer extends AsyncDisposable {
  /**
   * A promise that resolves once server finishes - eg. when aborted using the signal passed to `ServeOptions.signal
   */
  finished: Promise<void>;
  /**
   * Make the server block the event loop from finishing.
   *
   * Note: the server blocks the event loop from finishing by default. This method is only meaningful after `.unref()` is called.
   */
  ref(): void;
  /**
   * Make the server not block the event loop from finishing.
   */
  unref(): void;
  /**
   * Gracefully close the server. No more new connections will be accepted, while pending requests will be allowed to finish.
   */
  shutdown(): Promise<void>;
}

export type CommonOption =
  | (ServeInit & (ServeOptions | ServeTlsOptions))
  | ServeOptions
  | ServeTlsOptions;
