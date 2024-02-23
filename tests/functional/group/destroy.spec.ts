import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Group destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('should delete a group via the group`s ID', async ({ client, route, assert }) => {
    const group = await GroupFactory.query().create()
    const response = await client.delete(route('GroupsController.destroy', { id: group.id }))

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Group was deleted',
      data: group.id,
    })

    let deletedGroup
    try {
      deletedGroup = await Group.findOrFail(group.id)
    } catch (error) {
      assert.equal(error, 'Exception: E_ROW_NOT_FOUND: Row not found')
    }
    assert.isUndefined(deletedGroup)
  })
})
