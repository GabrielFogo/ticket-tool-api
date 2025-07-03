import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('status').notNullable()
      table.string('priority').notNullable()
      table.string('description', 1000).notNullable()

      table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.uuid('responsible_id').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.uuid('sector_id').notNullable().references('id').inTable('sectors').onDelete('CASCADE')

      table
        .uuid('enterprise_id')
        .notNullable()
        .references('id')
        .inTable('enterprises')
        .onDelete('CASCADE')

      table.integer('position').notNullable()

      table.timestamp('created_at').nullable()
      table.timestamp('started_at').nullable()
      table.timestamp('end_date').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
