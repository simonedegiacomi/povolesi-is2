module.exports = function (sequelize, DataTypes) {
    const Assignment = sequelize.define('Assignment', {
        id                 : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        name               : {
            type     : DataTypes.STRING(200),
            allowNull: false
        },
        startsOn           : {
            type        : DataTypes.DATE,
            allowNull   : false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        submissionDeadline : {
            type        : DataTypes.DATE,
            allowNull   : false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        peerReviewsDeadline: {
            type        : DataTypes.DATE,
            allowNull   : false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'assignment'
    });

    Assignment.associate = (models) => {
        Assignment.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                allowNull: false
            }
        });

        Assignment.belongsTo(models.UserGroup, {
            as: 'assignedUserGroup',
            foreignKey: {
                name: 'assignedUserGroupId',
                allowNull: false
            }
        });
    };

    return Assignment;
};
