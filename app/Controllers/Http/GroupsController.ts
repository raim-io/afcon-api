import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import GroupValidator from 'App/Validators/GroupValidator'

export default class GroupsController {
  /**
   * creating a group
   */
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(GroupValidator)
    const group = await Group.create({ ...payload })

    return response.created({ message: 'Group was created', data: group })
  }

  /**
   * listing all groups
   */
  public async index({ response }: HttpContextContract) {
    const groups = await Group.query().select(['id', 'name']).orderBy('name', 'asc')

    return response.ok({ data: groups })
  }

  /**
   * fetching a single group with all matches played in the group
   * and the result of the matches
   */
  public async show({ response, params }: HttpContextContract) {
    const requestedGroup = await Group.findOrFail(params.id)

    return response.ok({ data: requestedGroup })
  }

  /**
   * updating a single group
   */
  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(GroupValidator)
    const requestedGroup = await Group.findOrFail(params.id)

    requestedGroup?.merge({ ...payload })
    await requestedGroup?.save()

    return response.created({ message: 'Group was updated.', data: requestedGroup })
  }

  /**
   * deleting a single group
   */
  public async destroy({ response, params }: HttpContextContract) {
    const requestedGroup = await Group.findOrFail(params.id)
    await requestedGroup?.delete()

    return response.created({ message: 'Group was deleted.', data: requestedGroup?.id })
  }
}
