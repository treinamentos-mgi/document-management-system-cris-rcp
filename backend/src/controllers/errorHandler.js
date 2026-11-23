const multer = require('multer');

function errorHandler(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = status === 413
      ? 'Arquivo acima do limite permitido'
      : 'Falha no envio do arquivo';
    return res.status(status).json({ error: message });
  }
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}

module.exports = errorHandler;
