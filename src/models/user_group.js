
module.exports = (sequelize, DataTypes) => {
    const UserGroup = sequelize.define('UserGroup', {
        id  : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        name: {
            type     : DataTypes.STRING(200),
            allowNull: false
        }
    });

    UserGroup.associate = (models) => {
        UserGroup.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                allowNull: false
            }
        });
    };

    return UserGroup;
};
