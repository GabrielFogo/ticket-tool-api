import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminSectorMiddleware {
  async handle({ auth, params, response }: HttpContext, next: NextFn) {
    if (
      (auth.user!.isAdmin && auth.user?.sector_id === params.sectorId) ||
      auth.user?.sector_id === process.env.IDSECTORDEFAULT
    ) {
      return await next()
    }
    response.status(401).send('Unauthorized')
    return
  }
}
