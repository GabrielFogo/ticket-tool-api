import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ticket from './ticket.js'
import { randomUUID } from 'node:crypto'
import SectorEnterprise from './sector_enterprise.js'

export default class Enterprise extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare cnpj: string

  @hasMany(() => User, {
    foreignKey: 'enterpriseId',
  })
  declare users: HasMany<typeof User>

  @hasMany(() => SectorEnterprise, {
    foreignKey: 'enterpriseId',
  })
  declare sectors: HasMany<typeof SectorEnterprise>

  @hasMany(() => Ticket, {
    foreignKey: 'enterpriseId',
  })
  declare tickets: HasMany<typeof Ticket>

  @beforeCreate()
  static assignUuid(enterprise: Enterprise) {
    enterprise.id = randomUUID()
  }
}
