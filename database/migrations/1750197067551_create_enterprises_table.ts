import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enterprises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('cnpj').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
