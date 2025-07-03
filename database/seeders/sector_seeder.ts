import env from '#start/env'
import Sector from '#models/sector'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Sector.create({
      id: env.get('IDSECTORDEFAULT'),
      name: 'Adm',
      description: 'Admin',
      color: '#1D1D17',
    })
  }
}
