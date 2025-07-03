import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('tickets', (table) => {
      table.timestamp('eta')
    })
  }
}
