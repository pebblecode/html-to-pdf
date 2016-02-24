'use strict';

var page = require('webpage').create();
var system = require('system');
var address, output, size;

function newRandomString() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// the url we want to print to PDF
var address = system.args[1];
var filename = newRandomString() + '.pdf';

// set the viewport size, add options to allow customization of this
page.viewPortSize = {
    width: 600,
    height: 600
};

page.open(address, function (status) {
  if (status !== 'success') {
    phantom.exit(1);
  } else {
    page.render('./pdfs/' + filename, { format: 'pdf', quality: 100 });
    console.log(filename);
    phantom.exit(0);
  }
});
