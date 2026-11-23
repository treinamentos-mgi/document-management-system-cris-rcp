const path = require('path');
const config = require('../config');

const documents = new Map();

function save(metadata) {
  documents.set(metadata.id, metadata);
  return metadata;
}

function findById(id) {
  return documents.get(id) || null;
}

function findAllByOwner(owner) {
  return [...documents.values()].filter((document) => document.owner === owner);
}

function resolveFilePath(metadata) {
  return path.join(config.storageDir, metadata.storedName);
}

module.exports = { save, findById, findAllByOwner, resolveFilePath };
