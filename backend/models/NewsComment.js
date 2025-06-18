module.exports = (sequelize, DataTypes) => {
  const NewsComment = sequelize.define('NewsComment', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: DataTypes.INTEGER,
    newsId: DataTypes.INTEGER,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  });

  NewsComment.associate = (models) => {
    NewsComment.belongsTo(models.User, { foreignKey: 'userId', as: 'commentAuthor' });
    NewsComment.belongsTo(models.News, { foreignKey: 'newsId' });
  };

  return NewsComment;
};
