const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const { Part, PartComment, PartRating ,FavoritePart, User } = require('../index');


// ==============================
// ✅ Создание детали
// POST /parts
router.post('/parts', auth, upload.array('media', 5), async (req, res) => {
  try {
    const { title, description, brand, model, category, rarity, price } = req.body;
    const media = req.files?.map(file => `/uploads/media/${file.filename}`) || [];

    const part = await Part.create({
      title,
      description,
      brand,
      model,
      category,
      rarity,
      price,
      media,
      userId: req.userId
    });

    res.status(201).json({ msg: 'Деталь добавлена', part });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

// ==============================
// ✅ Получить весь каталог с фильтрацией
// GET /parts
router.get('/parts', async (req, res) => {
  const { brand, model, category, rarity, search } = req.query;

  const where = {};

  if (brand) where.brand = brand;
  if (model) where.model = model;
  if (category) where.category = category;
  if (rarity) where.rarity = rarity;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  try {
    const parts = await Part.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar'] }]
    });

    res.json(parts);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка получения запчастей', error: err.message });
  }
});

// ==============================
// ✅ Получить одну деталь
// GET /parts/:id
router.get('/parts/:id', async (req, res) => {
  try {
    const part = await Part.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'brand', 'model', 'category', 'rarity', 'price', 'media', 'rating', 'createdAt'],
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    if (!part) return res.status(404).json({ msg: 'Деталь не найдена' });
    res.json(part);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

// ==============================
// ✅ Удалить деталь
// DELETE /parts/:id
router.delete('/parts/:id', auth, async (req, res) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ msg: 'Деталь не найдена' });

    if (req.userRole !== 'admin' && part.userId !== req.userId) {
      return res.status(403).json({ msg: 'Нет прав на удаление' });
    }

    await part.destroy();
    res.json({ msg: 'Деталь удалена' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

// POST /parts/:id/comment
router.post('/parts/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 2) return res.status(400).json({ msg: 'Комментарий слишком короткий' });

  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ msg: 'Деталь не найдена' });

    const comment = await PartComment.create({
      partId: part.id,
      userId: req.userId,
      text
    });

    res.status(201).json({ msg: 'Комментарий добавлен', comment });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

// GET /parts/:id/comments
router.get('/parts/:id/comments', async (req, res) => {
  try {
    const comments = await PartComment.findAll({
      where: { partId: req.params.id },
      include: [{ model: User, as: 'commentAuthor', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка получения комментариев', error: err.message });
  }
});

// DELETE /parts/:partId/comments/:commentId
router.delete('/parts/:partId/comments/:commentId', auth, async (req, res) => {
  try {
    // Только для админа!
    if (req.userRole !== 'admin') return res.status(403).json({ msg: 'Нет прав' });
    const { commentId } = req.params;
    const rows = await PartComment.destroy({ where: { id: commentId, partId: req.params.partId } });
    if (rows === 0) return res.status(404).json({ msg: 'Комментарий не найден' });
    res.json({ msg: 'Комментарий удалён' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка удаления', error: err.message });
  }
});

// PUT /parts/:id/favorite
router.put('/parts/:id/favorite', auth, async (req, res) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ msg: 'Деталь не найдена' });

    await FavoritePart.findOrCreate({
      where: { userId: req.userId, partId: req.params.id }
    });

    res.json({ msg: 'Добавлено в избранное' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка избранного', error: err.message });
  }
});

// Удаление из избранного
router.delete('/parts/:id/favorite', auth, async (req, res) => {
  try {
    const rows = await FavoritePart.destroy({
      where: { userId: req.userId, partId: req.params.id }
    });

    if (rows > 0) {
      res.json({ msg: 'Удалено из избранного' });
    } else {
      res.status(404).json({ msg: 'Не найдено в избранном' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка удаления из избранного', error: err.message });
  }
});

// GET /users/me/favorites
router.get('/users/me/favorites', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: Part,
        as: 'favoriteParts'
      }]
    });

    res.json(user.favoriteParts);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка получения избранного', error: err.message });
  }
});

// PUT /parts/:id
router.put('/parts/:id', auth, upload.array('media', 5), async (req, res) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ msg: 'Деталь не найдена' });

    if (req.userRole !== 'admin' && part.userId !== req.userId) {
      return res.status(403).json({ msg: 'Нет прав на редактирование' });
    }
    
    // 1) Удаляем отмеченные картинки
    // Ожидаем, что фронтенд пришлет mediaToDelete — массив URL-строк
    let existingMedia = Array.isArray(part.media) ? part.media : [];
    const mediaToDelete = req.body?.mediaToDelete;
    if (mediaToDelete) {
      // если приходит строка, превращаем в массив
      const delList = Array.isArray(req.body.mediaToDelete)
        ? mediaToDelete
        : [mediaToDelete];
      existingMedia = existingMedia.filter(url => !delList.includes(url));
    }

    // 2) Добавляем новые файлы
    const newMedia = (req.files || []).map(
      file => `/uploads/media/${file.filename}`
    );

    // 3) Составляем окончательный массив
    const updatedMedia = [...existingMedia, ...newMedia];

    // 4) Обновляем все поля, включая media
    const updateData = {
      ...req.body,           // в req.body уже будут title, description и т.д.
      media: updatedMedia
    };

    await part.update(updateData);
    return res.json({ msg: 'Деталь обновлена', part });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка редактирования', error: err.message });
  }
});

// POST /part/:id/rate
router.post('/part/:id/rate', auth, async (req, res) => {
  const { rating } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).json({ msg: 'Недопустимая оценка' });

  try {
    // ⬇️ Создаём или обновляем рейтинг
    await PartRating.upsert({
      userId: req.userId,
      partId: req.params.id,
      rating
    });

    // После оценки — пересчитать среднее
    const ratings = await PartRating.findAll({ where: { partId: req.params.id } });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    const part = await Part.findByPk(req.params.id);
    part.rating = avg;
    await part.save();
    
    // ⬇️ Повторно загружаем обновлённый part (гарантия актуальности)
    const updatedPart = await Part.findByPk(req.params.id, {
      attributes: ['id', 'title', 'rating']
    });

    

    res.json({ msg: 'Оценка сохранена', part: updatedPart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка оценки', error: err.message });
  }
});

// GET /part/:id/rating
router.get('/part/:id/rating', auth, async (req, res) => {
  const existing = await PartRating.findOne({
    where: {
      userId: req.userId,
      partId: req.params.id
    }
  });
  res.json({ rating: existing?.rating || null });
});


module.exports = router;
