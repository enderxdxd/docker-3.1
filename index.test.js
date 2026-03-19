import { test } from 'node:test';
import assert from 'node:assert';

test('app responds with 200', async () => {
  const { createServer } = await import('./index.js');
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}`);
  assert.strictEqual(res.status, 200);

  server.close();
});