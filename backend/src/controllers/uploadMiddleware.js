const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const multer = require('multer');
const config = require('../config');

fs.mkdirSync(config.storageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: config.storageDir,
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadBytes, files: 1 },
});

module.exports = upload.single('file');
