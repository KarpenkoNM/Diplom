module.exports = (sequelize, DataTypes) => {
  const Part = sequelize.define('Part', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    brand: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    rarity: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'common' // 🟢 Значение по умолчанию
    },
    media: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });

  Part.associate = (models) => {
    Part.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
    Part.hasMany(models.PartComment, { foreignKey: 'partId', as: 'comments' });
    Part.belongsToMany(models.User, {
        through: 'FavoritePart', 
        foreignKey: 'partId', 
        as: 'favoritedBy'
    });
  };

  return Part;
};
