import Enterprise from '#models/enterprise'
import SectorEnterprise from '#models/sector_enterprise'
import User from '#models/user'
import { RegisterData } from '#validators/enterprise/register'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import db from '@adonisjs/lucid/services/db'

export default class RegisterService {
  private async createEnterprise(data: RegisterData): Promise<Enterprise> {
    const enterprise = await Enterprise.create({
      name: data.name,
      cnpj: data.cnpj,
    })

    return enterprise
  }

  private async createUser(enterprise: Enterprise, data: RegisterData): Promise<User> {
    const user = await enterprise.related('users').create({
      name: data.userName,
      email: data.email,
      isAdmin: true,
      password: data.password,
      sector_id: process.env.IDSECTORDEFAULT,
    })

    return user
  }

  private async createSectorEnterprise(enterprise: Enterprise): Promise<void> {
    await SectorEnterprise.create({
      sectorId: process.env.IDSECTORDEFAULT,
      enterpriseId: enterprise.id,
    })
  }

  public async handle(data: RegisterData): Promise<AccessToken> {
    await db.beginGlobalTransaction()

    try {
      const enterprise = await this.createEnterprise(data)

      await this.createSectorEnterprise(enterprise)

      const user = await this.createUser(enterprise, data)

      await db.commitGlobalTransaction()

      return User.accessTokens.create(user)
    } catch (error) {
      db.rollbackGlobalTransaction()

      throw error
    }
  }
}
