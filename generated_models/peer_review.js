/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('peer_review', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taskAnswerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'answer',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    mark: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'peer_review'
  });
};
