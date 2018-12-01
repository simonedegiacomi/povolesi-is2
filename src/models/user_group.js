
let UserGroup = function (sequelize, DataTypes) {
    let UserGroup = sequelize.define('UserGroup', {
        id       : {
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
        UserGroup.belongsTo(models.User, {as: 'CreatedBy'});
    };

    return UserGroup;
};

module.exports = UserGroup;