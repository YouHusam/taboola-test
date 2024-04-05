module.exports = async function () {
  // kill the server
  globalThis.__server__.close();
};
