import Sector from '#models/sector'
import SectorEnterprise from '#models/sector_enterprise'
import { sectorValidator } from '#validators/sector/sector'
import type { HttpContext } from '@adonisjs/core/http'

export default class SectorsController {
  async create({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(sectorValidator)
    const enterpriseId = auth.user!.enterpriseId!

    var sector = await Sector.findBy('name', data.name)
    if (!sector) {
      sector = await Sector.create({
        name: data.name,
        description: data.description,
        color: data.color ?? '#1D1D17',
      })
    }

    await SectorEnterprise.create({
      sectorId: sector.id,
      enterpriseId: enterpriseId,
    })

    return response.created({
      data: {
        id: sector.id,
        name: sector.name,
        description: sector.description,
        color: sector.color,
      },
    })
  }

  async getAll({ auth, response }: HttpContext) {
    const enterpriseId = auth.user!.enterpriseId!

    const sectorsEnterprise = await SectorEnterprise.query()
      .where('enterpriseId', enterpriseId)
      .preload('sector', (query) => {
        query.where('isActive', true)
      })

    return response.ok({
      data: sectorsEnterprise
        .filter((sectorEnterprise) => sectorEnterprise.sector) // só setores ativos
        .map((sectorEnterprise) => ({
          id: sectorEnterprise.sector.id,
          name: sectorEnterprise.sector.name,
          description: sectorEnterprise.sector.description,
          color: sectorEnterprise.sector.color,
        })),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(sectorValidator)
    const sector = await Sector.query().where('id', params.id).firstOrFail()

    await sector
      .merge({
        name: data.name,
        description: data.description,
        color: data.color,
      })
      .save()

    return response.ok({
      data: {
        id: sector.id,
        name: sector.name,
        description: sector.description,
        color: sector.color,
      },
    })
  }

  async changeStatus({ params, response }: HttpContext) {
    const sector = await Sector.query().where('id', params.id).firstOrFail()

    sector.isActive = !sector.isActive
    await sector.save()

    return response.noContent()
  }
}
