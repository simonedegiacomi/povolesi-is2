module.exports = function (sequelize, DataTypes) {
    const TaskAnswer = sequelize.define('TaskAnswer', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        submittedOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        answer: {
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

    TaskAnswer.associate = (models) => {
        TaskAnswer.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                allowNull: false
            }
        });

        TaskAnswer.belongsTo(models.Task, {
            as: 'task',
            foreignKey: {
                name: 'taskId',
                allowNull: false
            }
        });

        TaskAnswer.belongsTo(models.Assignment, {
            as: 'assignment',
            foreignKey: {
                name: 'assignmentId',
                allowNull: false
            }
        });
    };

    return TaskAnswer;
};
