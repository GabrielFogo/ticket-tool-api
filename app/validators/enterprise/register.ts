import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1),

    userName: vine.string().minLength(1),

    cnpj: vine
      .string()
      .regex(/^\d{14}$/)
      .unique(async (db, value) => {
        const exists = await db.from('enterprises').where('cnpj', value).first()
        return !exists
      }),

    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const exists = await db.from('users').where('email', value).first()
        return !exists
      }),

    password: vine.string().minLength(1),
  })
)

export type RegisterData = Infer<typeof registerValidator>
