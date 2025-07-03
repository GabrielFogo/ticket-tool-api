import Ticket from '#models/ticket'
import { createValidator } from '#validators/ticket/create'
import { otherSectorValidator } from '#validators/ticket/other_sector'
import { patchValidator } from '#validators/ticket/patch'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketsController {
  async create({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(createValidator)

    const ticket = await Ticket.create({
      title: data.title,
      description: data.description,
      createdBy: auth.user!.id,
      sectorId: data.sectorId,
      columnId: data.columnId,
      position: data.position,
      enterpriseId: auth!.user!.enterpriseId,
    })

    return response.created({ ticket })
  }

  async getByIdAndIsActive({ params, response }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .where('isActive', true)
      .preload('user')
      .preload('responsible')
      .preload('sector')
      .firstOrFail()

    return response.ok({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      createdBy: ticket.createdBy,
      userCreator: ticket.user.name,
      position: ticket.position,
      priority: ticket.priority,
      responsibleId: ticket.responsibleId!,
      responsibleName: ticket.responsible ? ticket.responsible.name : null,
      sector: {
        id: ticket.sector.id,
        name: ticket.sector.name,
        color: ticket.sector.color,
      },
    })
  }

  async updateTicket({ auth, params, request, response }: HttpContext) {
    const data = await request.validateUsing(patchValidator)

    const ticket = await Ticket.query().where('id', params.id).where('isActive', true).firstOrFail()

    if (ticket.createdBy !== auth.user!.id) {
      return response.forbidden('You are not allowed to update this ticket')
    }

    ticket.merge({
      title: data!.title,
      description: data!.description,
      priority: data!.priority,
    })

    await ticket.save()

    return response.ok({ id: ticket.id })
  }

  async moveToOtherSector({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(otherSectorValidator)

    const ticket = await Ticket.query()
      .where('id', data.ticketId)
      .where('enterpriseId', auth.user!.enterpriseId)
      .firstOrFail()

    ticket.merge({
      sectorId: data.sectorChangeId,
      columnId: data.columnId,
    })
    await ticket.save()

    return response.noContent()
  }

  async changeStatus({ auth, params, response }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .where('enterpriseId', auth.user!.enterpriseId)
      .firstOrFail()

    ticket.isActive = !ticket.isActive

    await ticket.save()

    return response.noContent()
  }
}
