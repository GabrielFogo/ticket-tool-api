import Ticket from '#models/ticket'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

export default class ResponsibleController {
  async index({ auth, response }: HttpContext) {
    const tickets = await Ticket.query()
      .where('responsible_id', auth.user!.id)
      .preload('column')
      .preload('sector')

    return response.ok({
      data: tickets.map((ticket) => ({
        id: ticket.column.id,
        name: ticket.column.name,
        tickets: {
          id: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
          userId: ticket.createdBy,
          sector: {
            id: ticket.sector.id,
            name: ticket.sector.name,
            color: ticket.sector.color,
          },
        },
      })),
    })
  }

  async setResponsible({ auth, params, request, response }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .where('enterpriseId', auth.user!.enterpriseId)
      .firstOrFail()

    const responsibleId = request.input('responsibleId') ?? auth.user!.id
    if (
      ticket.sectorId === auth.user?.sector_id ||
      auth.user?.isAdmin ||
      auth.user?.sector_id === env.get('IDSECTORDEFAULT')
    ) {
      ticket.responsibleId = responsibleId
      await ticket.save()
      return response.noContent()
    }

    return response.badRequest()
  }

  async getOutResponsible({ auth, params, response }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .where('responsibleId', auth.user?.id!)
      .where('enterpriseId', auth.user?.enterpriseId!)
      .firstOrFail()

    ticket.responsibleId = null
    ticket.save()
    return response.noContent()
  }
}
