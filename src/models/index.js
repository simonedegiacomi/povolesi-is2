const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);

const db       = {};
db.Sequelize = Sequelize;

function initDb() { 
    db.sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        logging: false
    });

    let models = {};

    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model    = db.sequelize['import'](path.join(__dirname, file));
            models[model.name] = model;
        });

    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(db);
        }
    });

    db.models = models;
}

initDb();

db.reinit = function(){
    initDb();
}

module.exports = db;
