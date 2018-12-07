module.exports = (sequelize, DataTypes) => {
    let TaskPool = sequelize.define('TaskPool', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    });

    TaskPool.associate = (models) => {
        TaskPool.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                allowNull: false
            }
        });

        TaskPool.belongsToMany(models.Task, {
            as: 'tasks',
            through: 'TaskPool_Task'
        });

        TaskPool.belongsToMany(models.Assignment, {
            as: 'assignment',
            through: 'Assignment_TaskPool'
        });

    };

    return TaskPool;
};
