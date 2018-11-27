/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assigned_task', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    assignmentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    taskId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'task',
        key: 'id'
      }
    }
  }, {
    tableName: 'assigned_task'
  });
};
