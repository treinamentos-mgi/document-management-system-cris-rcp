const path = require('path');

const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

module.exports = {
  storageDir: path.resolve(process.env.STORAGE_DIR || path.join(__dirname, '..', 'storage')),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || DEFAULT_MAX_UPLOAD_BYTES,
};
