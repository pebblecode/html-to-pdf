'use strict';

const spawn = require('child_process').spawn;
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();
server.connection({
  port: 3005,
  routes: {
      files: {
          relativeTo: Path.join(__dirname, 'pdfs')
      }
  }
});

server.register(Inert, () => {});

server.route({
    method: 'POST',
    path: '/',
    handler: generatePDF
});

server.route({
  method: 'GET',
  path: '/pdfs/{filename}',
  handler: function (request, reply) {
    reply.file(request.params.filename);
  }
});

server.start((err) => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
});

function generatePDF(request, reply) {
  const conv = spawn('./node_modules/.bin/phantomjs', ['conv.js', request.payload.url]);
  conv.stdout.on('data', (data) => {
    reply({
      url: `http://localhost:3005/pdfs/${data}`
    });
  });
  conv.stderr.on('data', (data) => {
    console.log('unexpected error');
    reply({
      error: 'an error occured while generating the filename'
    });
  });
  conv.on('close', (code) => console.log('closed exited'));
}
