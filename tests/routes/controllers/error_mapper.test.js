const UserHelper = require('../../helpers/user_helper');
const UsersGroupHelper = require('../../helpers/user_groups_helper');
const ModelsMapper = require('../../../src/routes/controllers/models_mapper');
const UserPermissionHelper = require('../../helpers/user_permission_helper');
const TaskHeper = require('../../helpers/task_helper');

function expectUserWithoutPasswordAndAuthToken(json, user) {
    expect(json).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        badgeNumber: user.badgeNumber
    });
}

describe('Test the user model mapper', () => {
    test('Should return the user without the password and auth token', async () => {
        const user = await UserHelper.insertGiorgio();

        const json = ModelsMapper.mapUser(user);

        expectUserWithoutPasswordAndAuthToken(json, user);
    });

    test('Should throw an error if mapUser is called with something that is not a user', () => {
        expect(() => ModelsMapper.mapUser({name: 'a'}))
            .toThrow(new Error('first argument is not an instance of User'));
    });
});

describe('Test the user group model mapper', () => {

    test('Should return the group with the user', async () => {
        const group = await UsersGroupHelper.createGroup();
        const creator = await group.getCreatedBy();

        const json = await ModelsMapper.mapUserGroup(group);
        expectUserWithoutPasswordAndAuthToken(json.createdBy, creator);
        delete json.createdBy;
        expect(json).toEqual({
            id: group.id,
            name: group.name
        });
    });

    test('Should throw an error if mapUserGroup is called with something that is not a userGroup', async () => {
        await expect(ModelsMapper.mapUserGroup({name: 'a'}))
            .rejects.toThrow(new Error('first argument is not an instance of UserGroup'));
    });

});


describe('Test the user permission mapper', () => {

    test('Should return the permission with the id of the group and the user and the permissions', async () => {
        const group = await UsersGroupHelper.createGroup();
        const permission = await UserPermissionHelper.insertUserPermission(group);
        const user = await permission.getUser();
        const json = ModelsMapper.mapUserPermission(permission);

        expect(json).toEqual({
            id: permission.id,
            userId: user.id,
            userGroupId: group.id,

            canChangePermissions: false,
            canManageTasks: false,
            canManageUsers: false
        });
    });

    test('Should throw an error if mapUserPermission is called with something that is not a UserPermission', () => {
        expect(() => ModelsMapper.mapUserPermission({name: 'a'}))
            .toThrow(new Error('first argument is not an instance of UserPermission'));
    });

});


describe('Test the task mapper', () => {

    test('Should return the task', async () => {
        const creator = await UserHelper.insertNewRandom();
        const task = await TaskHeper.createValidTask(creator.id);
        const json = await ModelsMapper.mapTask(task);

        expect(json).toEqual({
            canBePeerReviewed: task.canBePeerReviewed,
            id: task.id,
            maxLength: task.maxLength,
            question: task.question,
            type: task.type,
            userId: creator.id
        });
    });

    test('Should throw an error if mapTask is called with something that is not a Task', () => {
        expect(() => ModelsMapper.mapTask({name: 'a'}))
            .toThrow(new Error('first argument is not an instance of Task'));
    });
});

