

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


    UserPermission.associate = (models) => {
        UserPermission.belongsTo(models.User, {
            foreignKey: {
                unique: 'compositeIndex',
                name: 'userId',
                allowNull: false
            }
        });
        UserPermission.belongsTo(models.UserGroup, {
            foreignKey: {
                unique: 'compositeIndex',
                name: 'userGroupId',
                allowNull: false
            }
        });
    };


    return UserPermission;
};
