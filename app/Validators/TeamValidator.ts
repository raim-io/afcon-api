import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TeamValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params?.id ?? null,
  })

  public schema = schema.create({
    name: schema.string([
      rules.escape(),
      rules.trim(),
      rules.maxLength(50),
      rules.unique({
        table: 'teams',
        column: 'name',
        whereNot: this.refs?.id ? { id: this.refs.id } : {},
      }),
    ]),
    alias: schema.string.optional([rules.escape(), rules.trim(), rules.maxLength(60)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Team name is required',
    'name.maxLength': 'Team name should be the maximum of {{options.maxLength}} characters',
    'name.unique': 'Team name already exists',
    'alias.maxLength': 'Team alias should be the maximum of {{options.maxLength}} characters',
  }
}
