import { Injectable } from '@nestjs/common'
import { IFortune, Fortune } from '../../models/fortune'
import { ClientService } from '../../lib/client.service'

@Injectable()
export class FortuneService {
  async findByName(name: string): Promise<IFortune> {
    return await Fortune.findOne({ name })
  }
  async getHoroscope(params: string): Promise<IFortune> {
    return await ClientService.getHoroscope(params)
  }
  async constellationMmatching(params: string): Promise<IFortune> {
    return await ClientService.constellationMmatching(params)
  }
}
