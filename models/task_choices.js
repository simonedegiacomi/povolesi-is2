module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TaskChoices', {
        id    : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        taskId: {
            type      : DataTypes.INTEGER(11),
            allowNull : false,
            references: {
                model: 'task',
                key  : 'id'
            }
        },
        choice: {
            type     : DataTypes.STRING(500),
            allowNull: false
        }
    }, {
        tableName: 'task_choices'
    });
};
