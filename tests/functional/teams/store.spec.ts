import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a team', async ({ client, assert, route }) => {
    const helper = { name: 'Test --Team--.', alias: 'Team --Alias--.' }
    const response = await client.post(route('TeamsController.store')).form({
      name: helper.name,
      alias: helper.alias,
    })

    const persistedTeam = await Team.findOrFail(response.body().data.id)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Team was created',
      data: {
        name: helper.name,
        alias: helper.alias,
      },
    })
    assert.exists(persistedTeam)
  })

  test('should return 422 if the `name` and `alias` fields are of invalid length', async ({
    route,
    client,
  }) => {
    const helper = {
      name: 'Team NameTooLongNameTooLongNameTooLongNameTooLongNameTooLong',
      alias: 'Team AliasTooLongAliasTooLongAliasTooLongAliasTooLongAliasTooLong',
    }
    const response = await client
      .post(route('TeamsController.store'))
      .form({ name: helper.name, alias: helper.alias })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { message: 'Team name should be the maximum of 50 characters' },
        { message: 'Team alias should be the maximum of 60 characters' },
      ],
    })
  })

  test('should return 422 if the team name is not unique for creating a new team', async ({
    route,
    client,
  }) => {
    const existingTeam = await TeamFactory.query().create()
    const response = await client
      .post(route('TeamsController.store'))
      .form({ name: existingTeam.name, alias: existingTeam.alias })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ message: 'Team name already exists' }],
    })
  })
})
