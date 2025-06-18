const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создание директории /uploads/media, если её нет
const mediaDir = path.join(__dirname, '..', 'uploads', 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Хранилище файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Фильтр по MIME
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('❌ Недопустимый формат файла'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload; // ← именно ТАК!
