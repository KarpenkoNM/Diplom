const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
// 🧠 Инициализируем модели
const models = require('../index');
const { Thread, User, Comment } = models;


// ✅ СОЗДАНИЕ ТЕМЫ
router.post(
  '/thread',
  auth,
  upload.array('files', 5),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const files = req.files || [];

      const mediaUrls = files.map(file => `/uploads/media/${file.filename}`);

      const thread = await Thread.create({
        title,
        content,
        media: mediaUrls,
        userId: req.userId,
      });

      res.status(201).json({ msg: '✅ Тема создана', thread });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: '❌ Ошибка при создании темы' });
    }
  }
);

// ✅ ПОЛУЧЕНИЕ ТЕМ (список с фильтрами, сортировкой и пагинацией)
router.get('/threads', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sortMap = {
    newest: [['createdAt', 'DESC']],
    oldest: [['createdAt', 'ASC']],
    popular: [['likes', 'DESC']],
  };
  const sort = sortMap[req.query.sort] || sortMap['newest'];

  const where = {};
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { content: { [Op.iLike]: `%${req.query.search}%` } }
    ];
  }

  try {
    const { rows: threads, count: total } = await Thread.findAndCountAll({
      where,
      order: sort,
      limit,
      offset,
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    res.json({
      threads,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '❌ Ошибка получения тем', error: err.message });
  }
});

// Получить тему по ID с вложенными комментариями и авторами
router.get('/thread/:id', async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Comment,
          as: 'comments',
          where: { parentId: null }, // 🧠 только корневые
          required: false,
          include: [
            {
              model: User,
              as: 'commentAuthor',
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: Comment,
              as: 'replies', // 🔁 дочерние комментарии
              required: false,
              include: [
                {
                  model: User,
                  as: 'commentAuthor',
                  attributes: ['id', 'name', 'avatar']
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Comment, as: 'comments' }, 'createdAt', 'ASC'],
        [{ model: Comment, as: 'comments' }, { model: Comment, as: 'replies' }, 'createdAt', 'ASC']
      ]
    });

    if (!thread) {
      return res.status(404).json({ msg: '❌ Тема не найдена' });
    }

    res.json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '❌ Ошибка получения темы', error: err.message });
  }
});

router.post('/threads/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 2) {
    return res.status(400).json({ msg: 'Комментарий слишком короткий' });
  }

  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) return res.status(404).json({ msg: 'Тема не найдена' });

    const comment = await Comment.create({
      threadId: thread.id,
      userId: req.userId,
      text
    });

    res.status(201).json({ msg: 'Комментарий добавлен', comment });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.post('/comments/:parentId/reply', auth, async (req, res) => {
  const { text } = req.body;
  const parentId = req.params.parentId;

  if (!text || text.length < 2) {
    return res.status(400).json({ msg: 'Комментарий слишком короткий' });
  }

  try {
    const parent = await Comment.findByPk(parentId);
    if (!parent) return res.status(404).json({ msg: 'Родительский комментарий не найден' });

    const reply = await Comment.create({
      text,
      threadId: parent.threadId,
      userId: req.userId,
      parentId: parent.id
    });

    res.status(201).json({ msg: 'Ответ добавлен', comment: reply });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.put('/comments/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    comment.likes += 1;
    await comment.save();
    res.json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.put('/comments/:id/dislike', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    comment.dislikes += 1;
    await comment.save();
    res.json({ dislikes: comment.dislikes });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Комментарий не найден' });

    if (req.userRole !== 'admin') {
      return res.status(403).json({ msg: 'Недостаточно прав' });
    }

    await comment.destroy();
    res.json({ msg: 'Комментарий удалён' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});


router.put('/threads/:id/like', auth, async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) return res.status(404).json({ msg: 'Тема не найдена' });

    thread.likes += 1;
    await thread.save();

    res.json({ msg: 'Лайк добавлен', likes: thread.likes });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.delete('/threads/:id', auth, async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) return res.status(404).json({ msg: 'Тема не найдена' });

    if (req.userRole !== 'admin' && thread.userId !== req.userId) {
      return res.status(403).json({ msg: 'Нет прав на удаление' });
    }

    await thread.destroy();
    res.json({ msg: 'Тема удалена' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});

router.put('/threads/:id', auth, async (req, res) => {
  const { title, content, media } = req.body;
  const userId = req.userId;
  const userRole = req.userRole;

  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) return res.status(404).json({ msg: 'Тема не найдена' });

    if (thread.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ msg: 'Нет доступа к редактированию' });
    }

    thread.title = title || thread.title;
    thread.content = content || thread.content;
    if (media) thread.media = media;
    
    await thread.save();

    res.json({ msg: 'Тема обновлена', thread });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
});


module.exports = router;
