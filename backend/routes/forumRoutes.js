const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // 💡 теперь только этот
const threadRoutes = require('./threadRoutes');

// 👇 корректный upload endpoint
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  const urls = req.files.map(file => `/uploads/media/${file.filename}`);
  res.json({ urls });
});

router.use('/', threadRoutes);

module.exports = router;
