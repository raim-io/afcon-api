import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { GroupFactory } from 'Database/factories'

test.group('Group show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('should fetch a single group by the group`s ID', async ({ client, route, assert }) => {
    const group = await GroupFactory.query().create()

    const response = await client.get(route('GroupsController.show', { id: group.id }))

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: group.id,
        name: group.name,
      },
    })
    assert.deepEqual(group.id, response.body().data.id)
    assert.deepEqual(group.name, response.body().data.name)
  })
})
