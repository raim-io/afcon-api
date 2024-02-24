import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Group update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('should update/edit a group`s data via the group`s ID', async ({
    route,
    client,
    assert,
  }) => {
    const group = await GroupFactory.query().create()
    const response = await client
      .put(route('GroupsController.update', { id: group.id }))
      .form({ name: `Updated ${group.name}` })

    const persistedGroup = await Group.findOrFail(response.body().data.id)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Group was updated',
      data: {
        id: group.id,
      },
    })
    assert.isDefined(persistedGroup)
    assert.equal(persistedGroup.name, response.body().data.name)
    assert.notEqual(persistedGroup.name, group.name)
  })
})
