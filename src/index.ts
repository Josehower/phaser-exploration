import path from 'node:path';
import staticServer from '@fastify/static';
import fastify from 'fastify';

const app = fastify();

await app.register(staticServer, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

app.get('/', (x_req, response) => {
  return response
    .header('Content-Type', 'text/html')
    .status(200)
    .sendFile('index.html');
});

app.get('/index.js', (x_req, response) => {
  return response
    .header('Content-Type', 'application/javascript')
    .status(200)
    .sendFile('index.js');
});

// app.route({
//   method: 'GET',
//   url: '/',
//   schema: {
//     querystring: {
//       name: { type: 'string' },
//       excitement: { type: 'integer' },
//     },
//     response: {
//       200: {
//         type: 'object',
//         properties: {
//           hello: { type: 'string' },
//         },
//       },
//     },
//   },
//   handler: async function (request, reply) {
//     await reply.send({ hello: 'world' });
//   },
// });

interface Params {
  filename: string;
}

app.get<{
  Params: Params;
}>('/assets/:filename', (request, response) => {
  const { filename } = request.params;

  return response
    .header('Content-Type', 'image/png')
    .status(200)
    .sendFile(`/assets/${filename}`);
});

app.listen(
  {
    port: 8080,
    host: 'localhost',
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
