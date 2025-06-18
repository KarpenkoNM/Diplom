require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const forumRoutes = require('./routes/forumRoutes');
const threadRoutes = require('./routes/threadRoutes');
const partRoutes = require('./routes/partRoutes');
const newsRoutes = require('./routes/newsRoutes');


dotenv.config();
const path = require('path');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/forum', forumRoutes);
app.use('/api/thread', threadRoutes);
app.use('/api', partRoutes);
app.use('/api', newsRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // создает таблицы, если нет
    console.log('✅ Sequelize подключился и синхронизировался с БД');
  } catch (err) {
    console.error('❌ Ошибка при подключении к БД:', err.message);
  }
})();

app.get('/', (req, res) => {
  res.send('🔥 Бэкенд работает!');
});

module.exports = app;