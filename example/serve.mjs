import { Node, Response } from '../dist/index.mjs';

Node.serve(() => new Response('Hello World'));
