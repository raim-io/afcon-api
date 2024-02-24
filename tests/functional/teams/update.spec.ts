import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should update an existing team via the team`s ID', async ({ route, client, assert }) => {
    const existingTeam = await TeamFactory.query().create()
    const response = await client
      .put(route('TeamsController.update', { id: existingTeam.id }))
      .form({
        name: `Updated ${existingTeam.name}`,
        alias: `Updated ${existingTeam.alias ? existingTeam.alias : ''}`,
      })

    const persistedTeam = await Team.findOrFail(response.body().data.id)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Team was updated',
      data: {
        id: existingTeam.id,
      },
    })
    assert.isDefined(persistedTeam)
    assert.equal(persistedTeam.name, response.body().data.name)
    assert.notEqual(persistedTeam.name, existingTeam.name)
  })
})
