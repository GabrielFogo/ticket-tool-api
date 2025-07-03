import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const positioning = vine.compile(
  vine.object({
    columnIdFrom: vine.string().uuid(),
    columnIdTo: vine.string().uuid().optional(),
    ticketId: vine.string().uuid(),
    position: vine.number(),
  })
)

export type ColumnData = Infer<typeof positioning>
