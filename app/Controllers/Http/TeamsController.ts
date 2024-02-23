import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import TeamValidator from 'App/Validators/TeamValidator'

export default class TeamsController {
  /**
   * creating a team
   */
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(TeamValidator)
    const group = await Team.create({ ...payload })

    return response.created({ messsage: 'Team was created', data: group })
  }

  /**
   * fetching all teams
   */
  public async index({ response }: HttpContextContract) {
    const teams = await Team.query().select(['id', 'name', 'alias']).orderBy('name', 'asc')

    return response.ok({ data: teams })
  }

  /**
   * fetch a single team
   */
  public async show({ requestedTeam, response }: HttpContextContract) {
    return response.ok({ data: requestedTeam })
  }

  /**
   * update a team
   */
  public async update({ requestedTeam, request, response }: HttpContextContract) {
    const payload = await request.validate(TeamValidator)

    requestedTeam?.merge({ ...payload })
    await requestedTeam?.save()

    return response.created({ message: 'Team was updated', data: requestedTeam })
  }

  /**
   * delete a team
   */
  public async destroy({ requestedTeam, response }: HttpContextContract) {
    await requestedTeam?.delete()

    return response.created({ message: 'Team was deleted', data: requestedTeam?.id })
  }
}
