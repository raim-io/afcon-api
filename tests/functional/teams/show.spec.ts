import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should fetch a single team via the team`s ID', async ({ client, route, assert }) => {
    const existingTeam = await TeamFactory.query().create()
    const response = await client.get(route('TeamsController.show', { id: existingTeam.id }))

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: existingTeam.id,
        name: existingTeam.name,
        alias: existingTeam.alias,
      },
    })
    assert.deepEqual(existingTeam.id, response.body().data.id)
    assert.deepEqual(existingTeam.name, response.body().data.name)
  })
})
