const User = require('./user');

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

    let User_ = User(sequelize, DataTypes);
    UserGroup.belongsTo(User_, {as: 'Creator'});

    return UserGroup;
};

module.exports = UserGroup;