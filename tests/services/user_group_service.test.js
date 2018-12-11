const UserGroupService = require('../../src/services/user_group_service');
const UserGroupHelper = require('../helpers/user_groups_helper');
const UserHelper = require('../helpers/user_helper');
const {UserGroup} = require('../../src/models');

describe('The user group creation', () => {
    test('It should create new groups', async () => {
        const groupData = {
            name: "test group",
            createdBy: await UserHelper.insertNewRandom()
        };

        const group = await UserGroupService.createGroup(groupData);
        expect(group.id).toBeAnInteger();

        const createdBy = await group.getCreatedBy();
        expect(createdBy.toJSON()).toEqual(groupData.createdBy.toJSON());
    });
});

describe('The user group collection', () => {
    test('It should show created groups', async () => {

        await UserGroupHelper.createGroup("A");
        await UserGroupHelper.createGroup("B");
        await UserGroupHelper.createGroup("C");

        const groups = await UserGroupService.getAllGroups();

        expect(groups.length).toBe(3);

        const names = groups.map(item => item.name);
        expect(['A', 'B', 'C'].every(name => names.indexOf(name) > -1)).toBe(true);
    });

    test('It should return an empty array when there are no groups', async () => {
        expect(await UserGroupService.getAllGroups()).toEqual([]);
    });

    test('It should return a specific user group given its id', async () => {
        const createdGroup = await UserGroupHelper.createGroup("A");

        const group = await UserGroupService.getGroupById(createdGroup.id);

        expect(group).toBeDefinedAndNotNull();
        expect(group.toJSON()).toEqual(createdGroup.toJSON());
    });

    test("It should throw an excpetion if I request a group that doesn't exist", async () => {
        try {
            await UserGroupService.getGroupById(123);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserGroupService.errors.GROUP_NOT_FOUND);
        }
    });

});

describe("Test the user group deletion", () => {
    test('It should delete an existing user group', async () => {
        const group = await UserGroupHelper.createGroup();
        const creator = await group.getCreatedBy();

        await UserGroupService.deleteById(creator, group.id);

        const loadedFromDb = await UserGroup.findOne({
            where: {id: group.id}
        });
        expect(loadedFromDb).toBeNull();
    });

    test("It should throw an exception if I try to delete a user group that doesn't exists", async () => {
        const user = await UserHelper.insertNewRandom();

        try {
            await UserGroupService.deleteById(user, 999);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserGroupService.errors.GROUP_NOT_FOUND);
        }
    });

    test("It should throw an exception when someone try to delete a group that he didn't create", async () => {
        const group = await UserGroupHelper.createGroup();
        const aUser = await UserHelper.insertNewRandom();

        try {
            await UserGroupService.deleteById(aUser, group.id);
            expect().toFail();
        } catch (e) {
            expect(e.message).toBe(UserGroupService.errors.UNAUTHORIZED);
        }
    });
});