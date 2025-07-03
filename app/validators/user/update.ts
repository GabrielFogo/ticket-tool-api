import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const updateUserValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
    name: vine.string().optional(),
    sectorId: vine.string().uuid(),
  })
)

export type CreateData = Infer<typeof updateUserValidator>
