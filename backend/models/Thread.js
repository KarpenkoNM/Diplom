// models/Thread.js
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Thread.associate = (models) => {
    // 🔗 Автор темы
    Thread.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });

    // 💬 Комментарии к теме
    Thread.hasMany(models.Comment, {
      foreignKey: 'threadId',
      as: 'comments',
      onDelete: 'CASCADE'
    });
  };

  return Thread;
};
