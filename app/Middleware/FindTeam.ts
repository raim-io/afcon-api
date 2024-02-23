import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class FindTeam {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { params, response } = ctx
    const { id } = params

    if (!id) {
      return response.badRequest({ mesage: 'Team ID not povided' })
    }

    let team
    try {
      team = await Team.findOrFail(id)
    } catch (error) {
      return response.notFound({ message: 'Team not found' })
    }
    ctx.requestedTeam = team

    await next()
  }
}
