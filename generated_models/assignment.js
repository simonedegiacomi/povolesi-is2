/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assignment', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    startsOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    submissionDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    peerReviewsDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    createdBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    assignedGroupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user_group',
        key: 'id'
      }
    }
  }, {
    tableName: 'assignment'
  });
};
