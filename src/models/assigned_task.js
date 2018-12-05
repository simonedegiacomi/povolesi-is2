module.exports = (sequelize, DataTypes) => {
    const AssignedTask = sequelize.define('AssignedTask', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        tableName: 'assigned_task'
    });

    AssignedTask.associate = (models) => {
        AssignedTask.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                allowNull: false
            }
        });

        AssignedTask.belongsTo(models.Assignment, {
            as: 'assignment',
            foreignKey: {
                name: 'assignmentId',
                allowNull: false
            }
        });

        AssignedTask.belongsTo(models.Task, {
            as: 'task',
            foreignKey: {
                name: 'taskId',
                allowNull: false
            }
        });
    };

    return AssignedTask;
};
