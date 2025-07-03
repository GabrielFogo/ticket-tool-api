import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const columnChangeValidator = vine.compile(
  vine.object({
    columnId: vine.string().uuid(),
    position: vine.number(),
  })
)

export type ColumnData = Infer<typeof columnChangeValidator>
