module.exports = function (sequelize, DataTypes) {
    return sequelize.define('UserGroup', {
        id       : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        groupName: {
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
        tableName: 'user_group'
    });
};
