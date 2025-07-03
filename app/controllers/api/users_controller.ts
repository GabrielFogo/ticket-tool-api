import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createValidator } from '#validators/user/create'
import { inject } from '@adonisjs/core'
import CreateService from '#services/user/create_service'
import { updateUserValidator } from '#validators/user/update'

@inject()
export default class UsersController {
  constructor(private createService: CreateService) {}

  async getAllUsersByEnterpriseId({ auth, response }: HttpContext) {
    const enterpriseId = auth.user!.enterpriseId!

    const users = await User.query()
      .where('enterpriseId', enterpriseId)
      .where('isActive', true)
      .preload('sector')

    return response.ok({
      data: users.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        sector: {
          id: user.sector.id,
          name: user.sector.name,
          color: user.sector.color,
        },
      })),
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const enterpriseId = auth.user!.enterpriseId!
    const user = await User.query()
      .where('id', params.id)
      .where('enterpriseId', enterpriseId)
      .firstOrFail()

    return response.ok({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  }

  async create({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(createValidator)

    const enterpriseId = auth.user?.enterpriseId!

    await this.createService.handle(data, enterpriseId)

    return response.noContent()
  }

  async update({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(updateUserValidator)
    const user = await User.query()
      .where('id', data.userId)
      .where('enterpriseId', auth!.user!.enterpriseId)
      .firstOrFail()

    user.merge({
      name: data.name!,
      sector_id: data.sectorId,
    })

    user.save()

    return response.noContent()
  }

  async changeStatus({ auth, params, response }: HttpContext) {
    const enterpriseId = auth.user!.enterpriseId!
    const user = await User.query()
      .where('id', params.id)
      .where('enterpriseId', enterpriseId)
      .firstOrFail()

    if (user.id === auth.user!.id) {
      return response.forbidden({ message: 'You cannot delete your own account.' })
    }

    user.isActive = !user.isActive
    await user.save()

    return response.noContent()
  }

  async updatePassword({ auth, request, response }: HttpContext) {
    const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])

    const user = auth.user!

    if (!(await user.verifyPassword(currentPassword))) {
      return response.badRequest({ message: 'Current password is incorrect.' })
    }

    user.password = newPassword
    await user.save()

    return response.noContent()
  }
}
