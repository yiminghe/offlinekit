var express = require('express');
var app = express();
const path = require('path');
const request = require('request');
const fs = require('fs');

function initServer({ buildDir }) {
  app.use(express.static(buildDir));

  const handle = (s) => (_, r) => {
    const assets = JSON.parse(
      fs.readFileSync(path.join(buildDir, 'asset-manifest.json'), 'utf-8'),
    );
    const url = `http://localhost:8080${assets.files[s]}`;
    console.log('request', url);
    request(url, (err, data, body) => {
      r.send(body);
    });
  };

  return {
    app,
    handle,
  };
}

exports.initServer = initServer;

