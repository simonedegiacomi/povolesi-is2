module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id                    : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        question              : {
            type     : DataTypes.TEXT,
            allowNull: false
        },
        type                  : {
            type     : DataTypes.ENUM('multiple', 'open', 'link'),
            allowNull: false
        },
        canBePeerReviewd      : {
            type     : DataTypes.BOOLEAN,
            allowNull: false
        },
        multipleChoicesAllowed: {
            type     : DataTypes.BOOLEAN,
            allowNull: true
        },
        openMaxLength         : {
            type        : DataTypes.INTEGER(11),
            allowNull   : true,
            defaultValue: '10000'
        }
    }, {
        tableName: 'task'
    });

    Task.associate = (models) => {
        Task.belongsToMany(models.TaskPool, {
            through: 'TaskPool_Task'
        });
    };

    return Task;
};
