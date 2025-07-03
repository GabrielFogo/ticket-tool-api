import vine from '@vinejs/vine'

export const patchValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(100).optional(),
    description: vine.string().maxLength(255).optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
  })
)
