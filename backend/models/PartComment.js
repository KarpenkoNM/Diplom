// models/PartComment.js
module.exports = (sequelize, DataTypes) => {
  const PartComment = sequelize.define('PartComment', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  PartComment.associate = (models) => {
    PartComment.belongsTo(models.Part, { foreignKey: 'partId' });
    PartComment.belongsTo(models.User, { foreignKey: 'userId', as: 'commentAuthor' });
  };

  return PartComment;
};
