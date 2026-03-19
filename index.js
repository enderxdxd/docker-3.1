import http from 'node:http';

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from SnapCart!');
}

export function createServer() {
  return http.createServer(handler);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  createServer().listen(3000);
}