
module.exports = function (sequelize, DataTypes) {
    const Answer = sequelize.define('Answer', {
        id            : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        submittedOn   : {
            type        : DataTypes.DATE,
            allowNull   : false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        openAnswer    : {
            type     : DataTypes.TEXT,
            allowNull: true
        },
        teacherMark   : {
            type     : DataTypes.INTEGER(4),
            allowNull: true
        },
        teacherComment: {
            type     : DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'answer'
    });

    Answer.associate = (models) => {
        Answer.belongsTo(models.User, {
            as        : 'user',
            foreignKey: {
                name     : 'userId',
                allowNull: false
            }
        });

        Answer.belongsTo(models.Task, {
            as: 'task',
            foreignKey: {
                name: 'taskId',
                allowNull: false
            }
        });

        Answer.belongsTo(models.Assignment, {
            as: 'assignment',
            foreignKey: {
                name: 'assignmentId',
                allowNull: false
            }
        });
    };

    return Answer;
};
