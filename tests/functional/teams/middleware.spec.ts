import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams middleware', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('`FindTeam` middleware should returns 404 if the requested group could not be found', async ({
    client,
    route,
    assert,
  }) => {
    const teamId = Math.random()
    const response = await client.get(route('TeamsController.show', { id: teamId }))

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Team not found',
    })

    let requestedTeam
    try {
      requestedTeam = await Team.findOrFail(teamId)
    } catch (error) {
      assert.equal(error, 'Exception: E_ROW_NOT_FOUND: Row not found')
    }
    assert.isUndefined(requestedTeam)
  })

  test('`FindTeam` middleware should return the requested team to the http context', async ({
    client,
    route,
    assert,
  }) => {
    const requestedTeam = await TeamFactory.query().create()
    const response = await client.get(route('TeamsController.show', { id: requestedTeam.id }))

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: requestedTeam.id,
        name: requestedTeam.name,
        alias: requestedTeam.alias,
      },
    })
    assert.equal(requestedTeam.id, response.body().data.id)
    assert.equal(requestedTeam.name, response.body().data.name)
    assert.equal(requestedTeam.alias, response.body().data.alias)
  })
})
