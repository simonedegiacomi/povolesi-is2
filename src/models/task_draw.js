module.exports = (sequelize, DataTypes) => {
    const TaskDraw = sequelize.define('TaskDraw', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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

    TaskDraw.associate = (models) => {
        TaskDraw.belongsTo(models.TaskPool, {
            as: 'taskPool',
            foreignKey: {
                name: 'taskPoolId',
                allowNull: false
            }
        });

        TaskDraw.belongsTo(models.Assignment, {
            as: 'assignment',
            foreignKey: {
                name: 'assignmentId',
                allowNull: false
            }
        });
    };

    return TaskDraw;
};
