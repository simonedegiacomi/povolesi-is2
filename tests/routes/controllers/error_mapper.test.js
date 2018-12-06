const UserHelper = require('../../helpers/user_helper');
const UsersGroupHelper = require('../../helpers/user_groups_helper')
const ModelsMapper = require('../../../src/routes/controllers/models_mapper');

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



