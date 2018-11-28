
const {UserGroup} = require('../models/index');

module.exports = {
    getAllGroups: function(){
        return UserGroup.findAll()
    },

    createGroup: function(group){
        return UserGroup.create(group);
    }
};