const { Node, Response } = require('../dist/index.js');

Node.serve(() => new Response('Hello World'));
