const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { Op } = require('sequelize');

const { News, NewsComment, User } = require('../index');

// 🔥 Создать новость
router.post('/news', auth, checkRole(['admin', 'moderator']), upload.array('media', 5), async (req, res) => {
  try {
    const { title, content } = req.body;
    const media = req.files?.map(file => `/uploads/media/${file.filename}`) || [];

    const news = await News.create({
      title,
      content,
      media,
      userId: req.userId
    });

    res.status(201).json({ msg: 'Новость опубликована', news });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка создания новости', error: err.message });
  }
});

// 📚 Получить все новости + пагинация + автор
router.get('/news', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const offset = (page - 1) * limit;
  const { search, sort } = req.query;
  const where = {};

  if (search && search.trim() !== '') {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } }
    ];
  }

  let order = [['createdAt', 'DESC']];
  if (sort === 'oldest') order = [['createdAt', 'ASC']];
  if (sort === 'popular') order = [['likes', 'DESC']];


  try {
    const { rows: news, count } = await News.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    res.json({
      news,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка получения новостей', error: err.message });
  }
});


// 🔍 Одна новость
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    if (!news) return res.status(404).json({ msg: 'Новость не найдена' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка', error: err.message });
  }
});

// 🗑 Удалить новость
router.delete('/news/:id', auth, checkRole(['admin', 'moderator']), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ msg: 'Новость не найдена' });

    await news.destroy();
    res.json({ msg: 'Новость удалена' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка удаления', error: err.message });
  }
});

// ✏ Обновить новость
router.put(
  '/news/:id',
  auth,
  checkRole(['admin', 'moderator']),
  upload.array('media', 5),
  async (req, res) => {
    try {
      const news = await News.findByPk(req.params.id);
      if (!news) return res.status(404).json({ msg: 'Новость не найдена' });

      const { title, content } = req.body;
      let media = news.media || [];

      if (req.files && req.files.length > 0) {
        media = req.files.map(file => `/uploads/media/${file.filename}`);
      }

      await news.update({ title, content, media });
      res.json({ msg: 'Новость обновлена', news });
    } catch (err) {
      res.status(500).json({ msg: 'Ошибка обновления', error: err.message });
    }
  }
);


// ❤️ Лайк новости
router.put('/news/:id/like', auth, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ msg: 'Новость не найдена' });

    const userId = req.userId;
    let liked = news.likedUserIds || [];
    let disliked = news.dislikedUserIds || [];

    // Если уже лайкал — убираем лайк (toggle)
    if (liked.includes(userId)) {
      liked = liked.filter(id => id !== userId);
    } else {
      liked = [...liked.filter(id => id !== userId), userId];
      disliked = disliked.filter(id => id !== userId); // убираем из дизлайков, если был
    }

    await news.update({
      likedUserIds: liked,
      dislikedUserIds: disliked,
      likes: liked.length,
      dislikes: disliked.length
    });

    res.json({
      likes: liked.length,
      dislikes: disliked.length,
      isLiked: liked.includes(userId),
      isDisliked: false
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка лайка', error: err.message });
  }
});

// 👎 Дизлайк новости
router.put('/news/:id/dislike', auth, async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ msg: 'Новость не найдена' });

    const userId = req.userId;
    let liked = news.likedUserIds || [];
    let disliked = news.dislikedUserIds || [];

    // Если уже дизлайкал — убираем дизлайк (toggle)
    if (disliked.includes(userId)) {
      disliked = disliked.filter(id => id !== userId);
    } else {
      disliked = [...disliked.filter(id => id !== userId), userId];
      liked = liked.filter(id => id !== userId); // убираем из лайков, если был
    }

    await news.update({
      likedUserIds: liked,
      dislikedUserIds: disliked,
      likes: liked.length,
      dislikes: disliked.length
    });

    res.json({
      likes: liked.length,
      dislikes: disliked.length,
      isLiked: false,
      isDisliked: disliked.includes(userId)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка дизлайка', error: err.message });
  }
});


// 💬 Добавить комментарий
router.post('/news/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 2) return res.status(400).json({ msg: 'Комментарий слишком короткий' });

  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ msg: 'Новость не найдена' });

    const comment = await NewsComment.create({
      newsId: news.id,
      userId: req.userId,
      text
    });

    res.status(201).json({ msg: 'Комментарий добавлен', comment });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка комментария', error: err.message });
  }
});

// 💬 Получить комментарии
router.get('/news/:id/comments', async (req, res) => {
  try {
    const comments = await NewsComment.findAll({
      where: { newsId: req.params.id },
      include: [{ model: User, as: 'commentAuthor', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка получения комментариев', error: err.message });
  }
});

// ❤️ Лайк комментария (антиспам)
router.put('/news/comment/:id/like', auth, async (req, res) => {
  try {
    const comment = await NewsComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    const userId = req.userId;
    let liked = comment.likedUserIds || [];
    let disliked = comment.dislikedUserIds || [];

    if (liked.includes(userId)) {
      liked = liked.filter(id => id !== userId); // убираем лайк (toggle)
    } else {
      liked = [...liked.filter(id => id !== userId), userId];
      disliked = disliked.filter(id => id !== userId); // убираем дизлайк, если был
    }

    await comment.update({
      likedUserIds: liked,
      dislikedUserIds: disliked,
      likes: liked.length,
      dislikes: disliked.length
    });

    res.json({
      likes: liked.length,
      dislikes: disliked.length,
      isLiked: liked.includes(userId),
      isDisliked: false
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка лайка', error: err.message });
  }
});

// 👎 Дизлайк комментария (антиспам)
router.put('/news/comment/:id/dislike', auth, async (req, res) => {
  try {
    const comment = await NewsComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    const userId = req.userId;
    let liked = comment.likedUserIds || [];
    let disliked = comment.dislikedUserIds || [];

    if (disliked.includes(userId)) {
      disliked = disliked.filter(id => id !== userId); // убираем дизлайк (toggle)
    } else {
      disliked = [...disliked.filter(id => id !== userId), userId];
      liked = liked.filter(id => id !== userId); // убираем лайк, если был
    }

    await comment.update({
      likedUserIds: liked,
      dislikedUserIds: disliked,
      likes: liked.length,
      dislikes: disliked.length
    });

    res.json({
      likes: liked.length,
      dislikes: disliked.length,
      isLiked: false,
      isDisliked: disliked.includes(userId)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка дизлайка', error: err.message });
  }
});


// 🗑 Удалить комментарий к новости
router.delete('/news/comment/:id', auth, async (req, res) => {
  try {
    const comment = await NewsComment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    // 🛡️ Только автор или модератор
    if (comment.userId !== req.userId) {
      return res.status(403).json({ msg: 'Нет доступа к удалению комментария' });
    }

    await comment.destroy();
    res.json({ msg: 'Комментарий удалён' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка при удалении', error: err.message });
  }
});


module.exports = router;
