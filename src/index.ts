import { NodeServe } from './serve';

export interface UltraNode {
  serve: typeof NodeServe;
}

export const Node: UltraNode = {
  serve: NodeServe,
};

export { Request, Response, Headers } from 'undici';
