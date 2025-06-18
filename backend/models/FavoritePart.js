// models/FavoritePart.js
module.exports = (sequelize, DataTypes) => {
  const FavoritePart = sequelize.define('FavoritePart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'FavoriteParts', // Явное имя таблицы
    timestamps: true            // createdAt, updatedAt
  });

  // 💡 Обычно в many-to-many не нужны ассоциации, но если хочешь — можно добавить:
  FavoritePart.associate = (models) => {
    FavoritePart.belongsTo(models.User, { foreignKey: 'userId' });
    FavoritePart.belongsTo(models.Part, { foreignKey: 'partId' });
  };

  return FavoritePart;
};
