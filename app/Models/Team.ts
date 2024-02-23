import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class Team extends BaseModel {
  public static selfAssignPrimayKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public alias: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'UpdatedAt' })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateCUID(team: Team): void {
    team.id = cuid()
  }
}
