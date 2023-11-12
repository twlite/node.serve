# `Node.serve()`

This is a demo project that attempts to mirror partial `Deno.serve()` api in Node.js.

I don't recommend this for production. It is fine to use for development and playing around.

If you are interested in making this project production ready, please let me know.

# Installation

```sh
$ npm i serve.node
```

# Documentation

This project was created by taking references from [Deno.serve (v1.38.1)](https://deno.land/api@v1.38.1?s=Deno.serve) api documentation.
Therefore, things should work similarly.

# Example

Run the following code:

```js
import { Node, Response } from 'serve.node';

Node.serve(() => new Response('Hello World'));
```

It spins up an http server on port `8000` by default.

You can then make a request to the server:

```js
const res = await fetch('http://localhost:8000');
const body = await res.text();

console.log(body); // 'Hello World'
```
