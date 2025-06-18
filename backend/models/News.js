module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    likedUserIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: []
    },
    dislikedUserIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: []
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  News.associate = (models) => {
    News.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    News.hasMany(models.NewsComment, { foreignKey: 'newsId', as: 'comments' });
  };

  return News;
};
