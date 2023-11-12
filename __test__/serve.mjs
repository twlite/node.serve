import { test, describe } from 'node:test'
import { strictEqual } from 'node:assert';
import { Node } from '../dist/index.mjs';

describe('Node.serve', () => {
    test('it should spin up a server', () => {
        const server = Node.serve({
            port: 8080,
            onListen: ({ port }) => {
                strictEqual(port, 8080);
                server.shutdown();
            },
            handler: () => new Response('Hello World'),
        });
    });

    test('it should respond to requests', async () => {
        const server = Node.serve({ port: 8081 }, () => {
            return new Response('Hello World');
        });

        const response = await fetch('http://localhost:8081');
        const text = await response.text();

        await server.shutdown();

        strictEqual(text, 'Hello World');
    });

    test('it should handle POST request', async () => {
        const server = Node.serve({ port: 8082 }, async (req) => {
            if (req.method !== 'POST') {
                return new Response('Method not allowed', { status: 405 });
            }

            const { value } = await req.json();

            return new Response(`You sent ${value}`);
        });

        const response = await fetch('http://localhost:8082', {
            method: 'POST',
            body: JSON.stringify({ value: 'Hello World' }),
        });
        const text = await response.text();

        await server.shutdown();

        strictEqual(text, 'You sent Hello World');
    });
});