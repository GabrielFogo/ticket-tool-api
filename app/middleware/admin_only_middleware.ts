import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminOnlyMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    if (!auth.user!.isAdmin) {
      response.status(401).send('Unauthorized')
      return
    }

    return await next()
  }
}
