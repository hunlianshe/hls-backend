import { Module } from '@nestjs/common'
import { LibModule } from '../../lib/lib.module'
import { OrderPayController } from './order-pay.controller'
import { OrderPayService } from './order-pay.service'

@Module({
  imports: [LibModule],
  providers: [OrderPayService],
  controllers: [OrderPayController],
})
export class OrderPayModule {}
