module.exports = function (sequelize, DataTypes) {
    const PeerReview = sequelize.define('PeerReview', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        mark: {
            type: DataTypes.INTEGER(4),
            allowNull: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'peer_review'
    });

    PeerReview.associate = (models) => {
        PeerReview.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                allowNull: false
            }
        });

        PeerReview.belongsTo(models.TaskAnswer, {
            as: 'answer',
            foreignKey: {
                name: 'answerId',
                allowNull: false
            }
        });
    };

    return PeerReview;
};
