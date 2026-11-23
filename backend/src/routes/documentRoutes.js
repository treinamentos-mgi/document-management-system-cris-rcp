const express = require('express');
const documentController = require('../controllers/documentController');
const requireUser = require('../controllers/requireUser');
const uploadFile = require('../controllers/uploadMiddleware');

const router = express.Router();

router.post('/upload', requireUser, uploadFile, documentController.upload);
router.get('/documents', requireUser, documentController.list);
router.get('/documents/:id/download', requireUser, documentController.download);

module.exports = router;
