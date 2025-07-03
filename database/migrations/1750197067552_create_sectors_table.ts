import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sectors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('color').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
