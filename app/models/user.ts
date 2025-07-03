import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Enterprise from './enterprise.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Sector from './sector.js'
import Ticket from './ticket.js'
import { randomUUID } from 'node:crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare enterpriseId: string

  @column()
  declare sector_id: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isAdmin: boolean

  @column()
  declare isActive: boolean

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @belongsTo(() => Enterprise, {
    foreignKey: 'enterpriseId',
  })
  declare enterprise: BelongsTo<typeof Enterprise>

  @belongsTo(() => Sector, {
    foreignKey: 'sector_id',
  })
  declare sector: BelongsTo<typeof Sector>

  @hasMany(() => Ticket, {
    foreignKey: 'userId',
  })
  declare tickets: HasMany<typeof Ticket>

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
