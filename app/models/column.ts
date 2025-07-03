import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Enterprise from './enterprise.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Ticket from './ticket.js'
import { randomUUID } from 'node:crypto'

export default class Column extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare enterpriseId: string

  @column()
  declare position: number

  @belongsTo(() => Enterprise, {
    foreignKey: 'enterpriseId',
  })
  declare enterprise: BelongsTo<typeof Enterprise>

  @hasMany(() => Ticket, {
    foreignKey: 'columnId',
  })
  declare tickets: HasMany<typeof Ticket>

  @beforeCreate()
  static assignUuid(columns: Column) {
    columns.id = randomUUID()
  }
}
