const documentService = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "file"' });
  }
  const document = documentService.registerDocument(req.file, req.owner);
  res.status(201).json(document);
}

function list(req, res) {
  res.json(documentService.listDocumentsByOwner(req.owner));
}

function download(req, res, next) {
  const info = documentService.getDownloadInfo(req.params.id, req.owner);
  if (!info) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }
  res.attachment(info.document.originalName);
  res.type(info.document.mimeType);
  res.sendFile(info.filePath, (error) => {
    if (error) next(error);
  });
}

module.exports = { upload, list, download };
