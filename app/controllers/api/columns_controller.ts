import type { HttpContext } from '@adonisjs/core/http'
import { columnValidator } from '#validators/columns/column'
import Column from '#models/column'
import { columnChangeValidator } from '#validators/columns/change_column'
import { positioning } from '#validators/columns/positioning'

export default class ColumnsController {
  async create({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(columnValidator)
    const enterpriseId = auth.user!.enterpriseId!

    const coluns = await Column.query().where('enterpriseId', enterpriseId)

    const column = await Column.create({
      name: data.name,
      enterpriseId: enterpriseId,
      position: coluns.length > 0 ? coluns.length : 0,
    })

    return response.created({
      data: {
        id: column.id,
        name: column.name,
        position: column.position,
      },
    })
  }

  async repositioningTicket({ request, response }: HttpContext) {
    const data = await request.validateUsing(positioning)

    const columnFrom = await Column.query()
      .where('id', data.columnIdFrom)
      .preload('tickets')
      .firstOrFail()

    const ticketIndex = columnFrom.tickets.findIndex((t) => t.id === data.ticketId)
    if (ticketIndex === -1) {
      return response.notFound({ message: 'Ticket não encontrado na coluna de origem.' })
    }
    const ticket = columnFrom.tickets[ticketIndex]

    if (!data.columnIdTo || data.columnIdTo === data.columnIdFrom) {
      const pos = Math.max(0, Math.min(data.position, columnFrom.tickets.length - 1))
      moveArrayItem(columnFrom.tickets, ticketIndex, pos)
      for (let i = 0; i < columnFrom.tickets.length; i++) {
        columnFrom.tickets[i].position = i
        await columnFrom.tickets[i].save()
      }
      return response.noContent()
    }

    const columnTo = await Column.query()
      .where('id', data.columnIdTo)
      .preload('tickets')
      .firstOrFail()

    columnFrom.tickets.splice(ticketIndex, 1)

    ticket.columnId = data.columnIdTo
    await ticket.save()

    const insertPos = Math.max(0, Math.min(data.position, columnTo.tickets.length))
    columnTo.tickets.splice(insertPos, 0, ticket)

    for (let i = 0; i < columnTo.tickets.length; i++) {
      columnTo.tickets[i].position = i
      await columnTo.tickets[i].save()
    }

    return response.noContent()
  }

  async findAll({ auth, response }: HttpContext) {
    const columns = await Column.query()
      .where('enterpriseId', auth!.user!.enterpriseId)
      .orderBy('position')
      .preload('tickets', (query) => {
        query.where('isActive', true).preload('sector')
      })

    return response.ok({
      data: columns.map((column) => ({
        id: column.id,
        name: column.name,
        position: column.position,
        tickets: column.tickets.map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
          userId: ticket.createdBy,
          position: ticket.position,
          responsibleId: ticket?.responsibleId,
          createdAt: ticket.createdAt,
          sector: {
            id: ticket.sector.id,
            name: ticket.sector.name,
            color: ticket.sector.color,
          },
        })),
      })),
    })
  }

  async moveColumn({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(columnChangeValidator)
    const columns = await Column.query().where('enterpriseId', auth.user!.enterpriseId)
    if (columns.length >= data.position) {
      const columnIndex = columns.findIndex((t) => t.id === data.columnId)
      moveArrayItem(columns, columnIndex, data.position)
      let i = 0
      for (const columnI of columns) {
        columnI.position = i
        await columnI.save()
        i++
      }
    }

    return response.noContent()
  }

  async changeStatus({ auth, params, response }: HttpContext) {
    await Column.query()
      .where('id', params.id)
      .where('enterpriseId', auth.user?.enterpriseId!)
      .delete()

    return response.noContent()
  }
}

function moveArrayItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const item = arr.splice(fromIndex, 1)[0]
  arr.splice(toIndex, 0, item)
  return arr
}
