import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.renameColumn('full_name', 'name')
      table.boolean('is_active').notNullable().defaultTo(true)
    })

    this.schema.alterTable('sectors', (table) => {
      table.boolean('is_active').notNullable().defaultTo(true)
    })

    this.schema.alterTable('tickets', (table) => {
      table.boolean('is_active').notNullable().defaultTo(true)
    })
  }
}
