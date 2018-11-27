/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('task_draw', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assignmentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'assignment',
        key: 'id'
      }
    },
    taskPoolId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'task_pool',
        key: 'id'
      }
    },
    numQuestionsToDraw: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false
    },
    minPerQuestionDraw: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false
    }
  }, {
    tableName: 'task_draw'
  });
};
