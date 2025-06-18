const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  car_brand: {
    type: DataTypes.STRING
  },
  car_model: {
    type: DataTypes.STRING
  },
  car_year: {
    type: DataTypes.STRING
  },
  engine: DataTypes.STRING,
  suspension: DataTypes.STRING,
  aero: DataTypes.STRING,
  interior: DataTypes.STRING
});

// 🧩 Ассоциации
User.associate = (models) => {
  // Автор тем
  User.hasMany(models.Thread, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  // Автор комментариев
  User.hasMany(models.Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasMany(models.Part, { 
    foreignKey: 'userId' 
  });
  User.hasMany(models.PartComment, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
  });
  User.belongsToMany(models.Part, {
    through: 'FavoritePart',
    foreignKey: 'userId',
    as: 'favoriteParts'
  });
  User.hasMany(models.News, { 
    foreignKey: 'userId' 
  });
  User.hasMany(models.NewsComment, { 
    foreignKey: 'userId' 
  });
};

module.exports = User;
