/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answer_choice', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    answerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'answer',
        key: 'id'
      }
    },
    choice: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'answer_choice'
  });
};
