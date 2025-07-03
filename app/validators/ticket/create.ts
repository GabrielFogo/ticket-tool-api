import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(100),
    description: vine.string().maxLength(255),
    status: vine.enum(['open', 'in_progress', 'closed']).optional(),
    columnId: vine.string().uuid().optional(),
    sectorId: vine.string().uuid().optional(),
    eta: vine.date().optional(),
    position: vine.number(),
  })
)
