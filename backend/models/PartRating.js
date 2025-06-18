// models/PartRating.js
module.exports = (sequelize, DataTypes) => {
  const PartRating = sequelize.define('PartRating', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    }
  });

  PartRating.associate = (models) => {
    PartRating.belongsTo(models.User, { foreignKey: 'userId' });
    PartRating.belongsTo(models.Part, { foreignKey: 'partId' });
  };

  return PartRating;
};
