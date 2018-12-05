module.exports = (sequelize, DataTypes) => {

    const Types = ['multiple', 'open', 'link'];

    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(...Types),
            allowNull: false
        },
        canBePeerReviewed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        multipleChoicesAllowed: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        maxLength: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '10000'
        }
    }, {
        tableName: 'task'
    });
    Task.Types = Types;

    Task.associate = (models) => {
        Task.belongsTo(models.User, {as: 'user'});

        Task.belongsToMany(models.TaskPool, {
            as: 'taskPools',
            through: 'TaskPool_Task'
        });
    };

    return Task;
};