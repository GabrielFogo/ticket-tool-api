import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Enterprise from './enterprise.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sector from './sector.js'
import User from './user.js'
import Column from './column.js'
import { randomUUID } from 'node:crypto'

export type TicketPriority = 'low' | 'medium' | 'high'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare priority: TicketPriority

  @column()
  declare createdBy: string

  @column()
  declare responsibleId: string | null

  @column()
  declare sectorId: string

  @column()
  declare enterpriseId: string

  @column()
  declare isActive: boolean

  @column()
  declare columnId: string

  @column()
  declare position: number

  @column.dateTime()
  declare eta: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'responsibleId',
  })
  declare responsible: BelongsTo<typeof User>

  @belongsTo(() => Sector, {
    foreignKey: 'sectorId',
  })
  declare sector: BelongsTo<typeof Sector>

  @belongsTo(() => Enterprise, {
    foreignKey: 'enterpriseId',
  })
  declare enterprise: BelongsTo<typeof Enterprise>

  @belongsTo(() => Column, {
    foreignKey: 'columnId',
  })
  declare column: BelongsTo<typeof Column>

  @beforeCreate()
  static assignUuid(ticket: Ticket) {
    ticket.id = randomUUID()
  }
}
