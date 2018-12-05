const BCRYPT_HASH_LENGTH = 90;
const AUTH_TOKEN_LENGTH = 255;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.CHAR(BCRYPT_HASH_LENGTH),
            allowNull: false
        },
        badgeNumber: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        authToken: {
            type: DataTypes.STRING(AUTH_TOKEN_LENGTH),
            allowNull: true
        }
    }, {
        tableName: 'user'
    });

    return User;
};
