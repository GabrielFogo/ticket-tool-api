import vine from '@vinejs/vine'

export const otherSectorValidator = vine.compile(
  vine.object({
    sectorChangeId: vine.string().uuid(),
    ticketId: vine.string().uuid(),
    columnId: vine.string().uuid(),
  })
)
