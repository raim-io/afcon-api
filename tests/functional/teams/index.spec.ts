import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return a list of all teams', async ({ route, client, assert }) => {
    await Team.query().delete()
    await TeamFactory.query().createMany(15)
    const response = await client.get(route('TeamsController.index'))

    const existingTeams = await Team.query().orderBy('name', 'asc')
    const existingTeamIds = existingTeams.map((team) => team.id)
    const responseDataIds = response.body().data.map((data) => data.id)

    response.assertStatus(200)
    response.assertBodyContains({ data: [{}] })
    assert.deepEqual(existingTeamIds, responseDataIds)
  })
})
