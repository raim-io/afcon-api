import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Middlewares', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('`FindGroup` middleware should returns the requested Group to the http context', async ({
    client,
    route,
    assert,
  }) => {
    const requestedGroup = await GroupFactory.query().create()
    const response = await client.get(route('GroupsController.show', { id: requestedGroup.id }))

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: requestedGroup.id,
        name: requestedGroup.name,
      },
    })
    assert.equal(requestedGroup.id, response.body().data.id)
    assert.equal(requestedGroup.name, response.body().data.name)
  })

  test('`FindGroup` middleware should returns 404 if ID of the requested group was ot found', async ({
    client,
    route,
    assert,
  }) => {
    const groupId = Math.random()
    const response = await client.get(route('GroupsController.show', { id: groupId }))

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Group not found',
    })

    let requestedGroup
    try {
      requestedGroup = await Group.findOrFail(groupId)
    } catch (error) {
      assert.equal(error, 'Exception: E_ROW_NOT_FOUND: Row not found')
    }
    assert.isUndefined(requestedGroup)
  })
})
