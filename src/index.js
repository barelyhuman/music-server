import app from 'ftrouter';
import http from 'http';
import path from 'path';

const PORT = process.env.PORT || 3000;

async function main() {
  const handler = await app({
    basePath: path.join(__dirname, 'routes'),
  });

  http
    .createServer((req, res) => {
      handler(req, res);
    })
    .listen(PORT, () => {
      console.log('Listening on, ' + PORT);
    });
}

main();
