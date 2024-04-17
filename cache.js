const { nanoid } = require("nanoid");

const CACHE = {};

function setData(data) {
  const id = nanoid();
  CACHE[id] = data;
  return id;
}

function getData(id) {
  const data = CACHE[id];
  delete CACHE[id];
  return data;
}

module.exports = { setData, getData };
