import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'columns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()

      table
        .uuid('enterprise_id')
        .notNullable()
        .references('id')
        .inTable('enterprises')
        .onDelete('CASCADE')

      table.integer('position').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
