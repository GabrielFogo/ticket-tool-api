import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('tickets', (table) => {
      table.string('priority').nullable().alter()
    })
  }
}
