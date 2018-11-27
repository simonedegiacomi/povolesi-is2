/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pools_tasks', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'task',
        key: 'id'
      }
    },
    poolId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'task_pool',
        key: 'id'
      }
    }
  }, {
    tableName: 'pools_tasks'
  });
};
