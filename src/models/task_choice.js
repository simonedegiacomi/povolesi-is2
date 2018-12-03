module.exports = function (sequelize, DataTypes) {
    const TaskChoice = sequelize.define('TaskChoice', {
        id    : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        choice: {
            type     : DataTypes.STRING(500),
            allowNull: false
        }
    }, {
        tableName: 'task_choices'
    });

    TaskChoice.associate = (models) => {
        TaskChoice.belongsTo(models.Task, {
            as        : 'task',
            foreignKey: {
                name     : 'taskId',
                allowNull: false
            }
        });
    };

    return TaskChoice;
};
