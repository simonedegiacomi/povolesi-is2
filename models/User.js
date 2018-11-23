'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        badgeNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        authToken: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });


    return User;
};