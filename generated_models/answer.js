/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answer', {
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
    taskId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'task',
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
    submittedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    openAnswer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacherMark: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    teacherComment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'answer'
  });
};
