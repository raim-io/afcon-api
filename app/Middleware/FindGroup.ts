import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'

export default class FindGroup {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const { response, params } = ctx
    const { id } = params

    let group
    try {
      group = Group.findOrFail(id)
    } catch (error) {
      return response.notFound({ message: 'Group not found' })
    }
    ctx.requestedGroup = group

    await next()
  }
}
