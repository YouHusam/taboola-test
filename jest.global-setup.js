module.exports = async function () {
  // Start a server to serve the widget files on localhost:8089 in test environment since we are not using ecmascript modules
  const httpServer = require('http-server');

  globalThis.__server__ = httpServer.createServer();
  globalThis.__server__.listen(8089);
}
