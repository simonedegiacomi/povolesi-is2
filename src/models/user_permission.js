const User      = require('./user');
const UserGroup = require('./user_group');

module.exports = function (sequelize, DataTypes) {
    let UserPermission = sequelize.define('UserPermission', {
        id                  : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        canManageTasks      : {
            type     : DataTypes.BOOLEAN,
            allowNull: false
        },
        canManageUsers      : {
            type     : DataTypes.BOOLEAN,
            allowNull: false
        },
        canChangePermissions: {
            type     : DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'user_permission'
    });

    //User
    let User_ = User(sequelize, DataTypes);
    UserPermission.belongsTo(User_, {as: 'User'});

    User_.belongsToMany(UserPermission, {through: 'Permissions'});

    //UserGroup
    let UserGroup_ = UserGroup(sequelize, DataTypes);
    UserGroup_.belongsToMany(UserPermission, {through: 'Permissions'});

    return UserPermission;
};
