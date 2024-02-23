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
  public async show({ params, response }: HttpContextContract) {
    const teamId = await params.id
    const team = await Team.findOrFail(teamId)

    return response.ok({ data: team })
  }

  /**
   * update a team
   */
  public async update({ request, response, params }: HttpContextContract) {
    const payload = request.body()
    const team = await Team.findOrFail(params.id)

    team?.merge({ ...payload })
    await team.save()

    return response.created({ message: 'Team was updated', data: team })
  }

  /**
   * delete a team
   */
  public async destroy({ params, response }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)
    await team?.delete()

    return response.created({ message: 'Team was deleted', data: team.id })
  }
}
