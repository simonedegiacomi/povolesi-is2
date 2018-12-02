const User = require('./user');
const Task = require('./task');

let TaskPool = function (sequelize, DataTypes) {
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
    };

    return TaskPool;
};

module.exports = TaskPool;
