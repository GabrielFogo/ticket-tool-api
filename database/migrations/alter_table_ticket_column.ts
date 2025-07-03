import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('tickets', (table) => {
      table.uuid('column_id').references('id').inTable('columns').onDelete('CASCADE')
    })
  }
}
