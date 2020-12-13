import { Module } from '@nestjs/common'
import { LibModule } from '../../lib/lib.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [LibModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
