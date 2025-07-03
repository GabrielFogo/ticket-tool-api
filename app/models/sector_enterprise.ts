import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Sector from './sector.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Enterprise from './enterprise.js'
import { randomUUID } from 'node:crypto'

export default class SectorEnterprise extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare sectorId: string

  @column()
  declare enterpriseId: string

  @belongsTo(() => Sector, {
    foreignKey: 'sectorId',
  })
  declare sector: BelongsTo<typeof Sector>

  @belongsTo(() => Enterprise, {
    foreignKey: 'enterpriseId',
  })
  declare enterprise: BelongsTo<typeof Enterprise>

  @beforeCreate()
  static assignUuid(sectorEnterprise: SectorEnterprise) {
    sectorEnterprise.id = randomUUID()
  }
}
