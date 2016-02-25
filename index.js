import {spawn} from 'child_process';
import Path from 'path';
import PDFMerge from 'pdf-merge';
import Hapi from 'hapi';
import fs from 'fs';
import Inert from 'inert';

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


function createPDF(url) {
  return new Promise((resolve, reject) => {
    const conv = spawn('phantomjs', ['conv.js', url]);
    conv.stdout.on('data', (data) => resolve(data));
    conv.stderr.on('data', (data) => reject(`Error converting ${url} to PDF`));
  });
}

function generatePDF(request, reply) {
  const files = request.payload.url;
  if (!Array.isArray(files) || !files.length) {
    return reply({
      error: 'Expected an array of urls to print to PDF. None was received'
    });
  }
  Promise.all([...files.map(url => createPDF.call(this, url))])
  .then(paths => {
    const fixedPaths = paths.map(p => {
      const path = p.toString();
      return `./pdfs/${path.replace(/\n/, '')}`
    });
    const pdfs = new PDFMerge(fixedPaths);
    pdfs.asReadStream().promise()
    .then(buffer => {
      fs.writeFile('./pdfs/newfile.pdf', buffer, (err) => {
        reply({
          error: err,
          file: fixedPaths
        });
      })
    }).catch(err => console.log(err));
  }).catch(err => console.log('err', err));
}
