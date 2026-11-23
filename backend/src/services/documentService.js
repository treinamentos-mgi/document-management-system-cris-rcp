const { randomUUID } = require('crypto');
const documentRepository = require('../repositories/documentRepository');

function toPublicMetadata(metadata) {
  const { storedName, ...publicFields } = metadata;
  return publicFields;
}

function registerDocument(file, owner) {
  const metadata = documentRepository.save({
    id: randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
  });
  return toPublicMetadata(metadata);
}

function listDocumentsByOwner(owner) {
  return documentRepository.findAllByOwner(owner).map(toPublicMetadata);
}

function getDownloadInfo(id, owner) {
  const metadata = documentRepository.findById(id);
  if (!metadata || metadata.owner !== owner) {
    return null;
  }
  return {
    document: toPublicMetadata(metadata),
    filePath: documentRepository.resolveFilePath(metadata),
  };
}

module.exports = { registerDocument, listDocumentsByOwner, getDownloadInfo };
