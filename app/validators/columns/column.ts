import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const columnValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255),
  })
)
export type ColumnData = Infer<typeof columnValidator>
