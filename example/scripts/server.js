const { initServer } = require('offlinekit/server');
const path = require('path');
const buildDir = path.join(__dirname, '../build');

const { app, handle } = initServer({
  buildDir,
});

app.get('/', handle('index.html'));
app.get(/.*\.html$/, handle('index.html'));

app.listen(8080);

console.log('http://127.0.0.1:8080/');
console.log();
