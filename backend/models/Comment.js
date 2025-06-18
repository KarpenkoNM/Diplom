module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    threadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  // 🧩 Ассоциации
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'commentAuthor' });
    Comment.belongsTo(models.Thread, { foreignKey: 'threadId' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parentId', as: 'parent' }); // 👈 родитель
    Comment.hasMany(models.Comment, { foreignKey: 'parentId', as: 'replies' });  // 👈 ответы
  };

  return Comment;
};
