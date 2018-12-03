module.exports = function (sequelize, DataTypes) {
    const AnswerChoice = sequelize.define('AnswerChoice', {
        id    : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        choice: {
            type     : DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'answer_choice'
    });

    AnswerChoice.associate = (models) => {
        AnswerChoice.belongsTo(models.Answer, {
            as        : 'answer',
            foreignKey: {
                name     : 'answerId',
                allowNull: false
            }
        });
    };

    return AnswerChoice;
};
