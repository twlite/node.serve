import type {
  ServeHandler,
  ServeInit,
  ServeOptions,
  ServeTlsOptions,
  HttpServer,
} from './common';
import { NodeHttpServer } from './HttpServer';

/**
 * Serves HTTP requests with the given handler.
 *
 * The below example serves with the port `8000` on hostname `"127.0.0.1"`.
 *
 * ```ts
 * Node.serve((_req) => new Response('Hello world!'));
 * ```
 */
export function NodeServe(handler: ServeHandler): HttpServer;
export function NodeServe(
  options: ServeInit & (ServeOptions | ServeTlsOptions)
): HttpServer;
export function NodeServe(
  options: ServeOptions | ServeTlsOptions,
  handler: ServeHandler
): HttpServer;
export function NodeServe(
  options:
    | ServeOptions
    | ServeTlsOptions
    | ServeHandler
    | (ServeInit & (ServeOptions | ServeTlsOptions)),
  handler?: ServeHandler
): HttpServer {
  let _handler: ServeHandler;

  if (typeof options === 'function') {
    _handler = options;
    options = {};
  } else if (typeof handler === 'function') {
    _handler = handler;
  } else if ('handler' in options) {
    _handler = options.handler;
  } else {
    throw new TypeError('Unspecified serve handler');
  }

  const server = new NodeHttpServer(_handler, options);

  return server;
}
