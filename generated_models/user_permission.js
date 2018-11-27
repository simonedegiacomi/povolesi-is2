/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_permission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user_group',
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
    canManageTasks: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    canManageUsers: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    canChangePermissions: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'user_permission'
  });
};
