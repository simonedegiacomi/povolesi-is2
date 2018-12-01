const User = require('./user');
const Task = require('./task');

let TaskPool = function (sequelize, DataTypes) {
    let TaskPool = sequelize.define('TaskPool', {
        id       : {
            type         : DataTypes.INTEGER(11),
            allowNull    : false,
            primaryKey   : true,
            autoIncrement: true
        },
        name     : {
            type     : DataTypes.STRING(200),
            allowNull: false

        }


    //il task pool viene creato da un solo utente
    let User_ = User(sequelize, DataTypes);
    TaskPool.belongsTo(User_, {as: 'createdBy'});

    //questo aggiunge un fk in Task che segnala a quale task pool appartiene
    let Task_ = Task(sequelize, DataTypes);
    TaskPool.hasMany(Task_, {as: 'task-pool'})

    return TaskPool;
};

module.exports = TaskPool;
