import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })
  test('should fetch all groups', async ({ client, assert, route }) => {
    await Group.query().delete()
    await GroupFactory.query().createMany(5)

    const response = await client.get(route('GroupsController.index'))
    const responseArrayData = response.body().data
    const groups = await Group.query().orderBy('name', 'asc')

    // get the ids of the response and existing groups
    const groupsIds: string[] = groups.map((group) => group.id)
    const responseArrayDataIds: string[] = responseArrayData.map((data) => data.id)

    groups.map((group) => {
      const groupsData = group.$attributes
      const foundGroups = responseArrayData.find(
        (responseArrayDataObject) => groupsData.id === responseArrayDataObject.id
      )
      assert.isDefined(foundGroups, 'Groups not found')
    })
    assert.deepEqual(groupsIds, responseArrayDataIds)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
    })
  })

  test('should successfully return an empty list when the groups table is empty', async ({
    client,
    route,
    assert,
  }) => {
    await Group.query().delete()

    const response = await client.get(route('GroupsController.index'))

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
  })
})
