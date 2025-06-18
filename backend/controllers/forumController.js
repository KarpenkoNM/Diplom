exports.uploadMedia = async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'Файл не загружен' });
  
    const mediaUrl = `/uploads/media/${req.file.filename}`;
    res.status(200).json({ msg: 'Файл загружен', url: mediaUrl });
};

exports.uploadMultipleMedia = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: 'Файлы не загружены' });
      }
  
      const urls = req.files.map(file => `/uploads/media/${file.filename}`);
      res.json({ msg: 'Файлы загружены', urls });
    } catch (err) {
      res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
    }
};
  