import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  test('create a new group', async ({ client, route, assert }) => {
    const groupName = 'Group Test.'
    const response = await client.post(route('GroupsController.store')).form({
      name: groupName,
    })
    const persistedGroup = await Group.findOrFail(response.body().data.id)

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Group was created',
      data: {
        name: groupName,
      },
    })
    assert.exists(persistedGroup)
  })

  test('return 422 if the name filed in the request body has invalid length for creating a group', async ({
    client,
    route,
  }) => {
    const groupName =
      'Group NameTooLongNameTooLongNameTooLongNameTooLongNameTooLongNameTooLongNameTooLongNameTooLong'
    const response = await client.post(route('GroupsController.store')).form({
      name: groupName,
    })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ message: 'Group name should be the maximum of 50 characters' }],
    })
  })

  test('return 422 if the name field in the request body is not unique for creating a group', async ({
    client,
    route,
  }) => {
    const existingGroup = await GroupFactory.query().create()
    const response = await client
      .post(route('GroupsController.store'))
      .form({ name: existingGroup.$attributes.name })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ message: 'Group name already exists' }],
    })
  })
})
