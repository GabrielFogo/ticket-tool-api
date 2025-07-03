import User from '#models/user'
import RegisterService from '#services/enterprise/register_service'
import { loginValidator } from '#validators/auth/login'
import { registerValidator } from '#validators/enterprise/register'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(private registerService: RegisterService) {}

  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const token = await this.registerService.handle(data)

    return response.ok(token)
  }

  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(data.email, data.password)

    const token = await User.accessTokens.create(user)

    return response.ok({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        sector_id: user.sector_id,
        accesstoken: token,
        isAdmin: user.isAdmin,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.noContent()
  }

  async checkSession({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()
      return response.ok({ authenticated: true })
    } catch {
      return response.unauthorized({ authenticated: false })
    }
  }

  async me({ auth, response }: HttpContext) {
    return response.ok({
      id: auth.user?.id,
      name: auth.user?.name,
      email: auth.user?.email,
      isAdmin: auth.user?.isAdmin,
      sector_id: auth.user?.sector_id,
    })
  }
}
