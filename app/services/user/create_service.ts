import User from '#models/user'
import { CreateData } from '#validators/user/create'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import EmailHelper from '../../helpers/email_helper.js'

export default class CreateService {
  private async createUser(data: CreateData, enterpriseId: string): Promise<User> {
    return await User.create({
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin ?? false,
      password: data.password,
      enterpriseId: enterpriseId,
      sector_id: data.sectorId,
    })
  }

  // private async sendWelcomeEmail(user: User): Promise<void> {
  //   const htmlContent = EmailHelper.welcomeEmail(user.name!)

  //   await mail.send((message) => {
  //     message
  //       .to(user.email)
  //       .from('no-reply@ticket.com')
  //       .subject('Bem-vindo ao Nosso Sistema')
  //       .html(htmlContent)
  //   })
  // }

  public async handle(data: CreateData, enterpriseId: string): Promise<void> {
    db.beginGlobalTransaction()

    try {
      const user = await this.createUser(data, enterpriseId)

      // await this.sendWelcomeEmail(user)

      await db.commitGlobalTransaction()
    } catch (error) {
      await db.rollbackGlobalTransaction()
      throw error
    }
  }
}
