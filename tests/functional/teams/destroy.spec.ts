import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import TeamFactory from 'Database/factories/TeamFactory'

test.group('Teams destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should delete a team via the team`s ID', async ({ client, route, assert }) => {
    const existingTeam = await TeamFactory.query().create()
    const response = await client.delete(route('TeamsController.destroy', { id: existingTeam.id }))

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Team was deleted',
      data: existingTeam.id,
    })

    // assert that team no longer exists within the database
    let deletedTeam
    try {
      deletedTeam = await Team.findOrFail(existingTeam.id)
    } catch (error) {
      assert.equal(error, 'Exception: E_ROW_NOT_FOUND: Row not found')
    }
    assert.isUndefined(deletedTeam)
  })
})
