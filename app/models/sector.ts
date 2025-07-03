import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Ticket from './ticket.js'
import { randomUUID } from 'node:crypto'

export default class Sector extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare isActive: boolean

  @column()
  declare color: string

  @hasMany(() => User, {
    foreignKey: 'sectorId',
  })
  declare users: HasMany<typeof User>

  @hasMany(() => Ticket, {
    foreignKey: 'sectorId',
  })
  declare tickets: HasMany<typeof Ticket>

  @beforeCreate()
  static assignUuid(sector: Sector) {
    if (!sector.id) {
      sector.id = randomUUID()
    }
  }
}
