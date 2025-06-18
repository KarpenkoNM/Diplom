const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { DataTypes } = require('sequelize');
const sequelize = require('./config/db');
const Thread = require('./models/Thread')(sequelize, DataTypes);
const path = require('path');
const Comment = require(path.join(__dirname, 'models', 'Comment'))(sequelize, DataTypes);
const User = require('./models/User');
const Part = require('./models/Part')(sequelize, DataTypes);
const PartComment = require('./models/PartComment')(sequelize, DataTypes);
const FavoritePart = require('./models/FavoritePart')(sequelize, DataTypes);
const News = require('./models/News')(sequelize, DataTypes);
const NewsComment = require('./models/NewsComment')(sequelize, DataTypes);
const PartRating = require('./models/PartRating')(sequelize, DataTypes);

// 💡 СОБИРАЕМ ВСЕ В models
const models = {
  User,
  Thread,
  Comment,
  Part,
  PartComment,
  PartRating,
  FavoritePart,
  News,
  NewsComment
};

// АССОЦИАЦИИ
if (User.associate) User.associate(models);
if (Thread.associate) Thread.associate(models);
if (Comment.associate) Comment.associate(models);
if (Part.associate) Part.associate(models);
if (PartComment.associate) PartComment.associate(models);
if (PartRating.associate) PartRating.associate(models);
if (News.associate) News.associate(models);
if (NewsComment.associate) NewsComment.associate(models);

models.sequelize = sequelize;
module.exports = models;
