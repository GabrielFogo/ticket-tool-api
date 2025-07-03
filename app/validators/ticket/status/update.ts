import vine from '@vinejs/vine'

export const updateValidator = vine.compile(
  vine.object({
    status: vine.enum(['open', 'in_progress', 'closed']).optional(),
  })
)
