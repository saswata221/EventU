// server/utils/logger.js
const util = require("util");

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

function error(...args) {
  console.error(new Date().toISOString(), ...args);
}

function debug(obj) {
  // safe inspect
  console.log(
    new Date().toISOString(),
    util.inspect(obj, { depth: 5, colors: false })
  );
}

module.exports = { log, error, debug };
