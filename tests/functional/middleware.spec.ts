import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { GroupFactory } from 'Database/factories'

test.group('Middlewares', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('middleware return the requested Group to the http context', async ({
    client,
    route,
    assert,
  }) => {
    const requestedGroup = await GroupFactory.query().create()
    const response = await client.get(route('GroupsController.show', { id: requestedGroup.id }))

    console.log(requestedGroup)

    response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: requestedGroup.id,
        name: requestedGroup.name,
      },
    })
    assert.equal(requestedGroup.$attributes.id, response.body().data.id)
    assert.equal(requestedGroup.$attributes.name, response.body().data.name)
  })

  test('return 404 if ID of the requested group was ot found', async ({ client, route }) => {
    const groupId = Math.random()
    const response = await client.get(route('GroupsController.show', { id: groupId }))

    response.dumpBody()
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Group not found',
    })
  })
})
