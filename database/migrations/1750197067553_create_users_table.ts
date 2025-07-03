import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('enterprise_id')
        .notNullable()
        .references('id')
        .inTable('enterprises')
        .onDelete('CASCADE')

      table.uuid('sector_id').nullable().references('id').inTable('sectors').onDelete('CASCADE')

      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.boolean('is_admin').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
