module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TaskPool', {
        id       : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        name     : {
            type     : DataTypes.STRING(200),
            allowNull: false
        },
        createdBy: {
            type      : DataTypes.INTEGER(11),
            allowNull : false,
            references: {
                model: 'user',
                key  : 'id'
            }
        }
    }, {
        tableName: 'task_pool'
    });
};
