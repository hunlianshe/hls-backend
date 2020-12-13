import { Module } from '@nestjs/common'
import { CollectionService } from './collection.service'
import { CollectionController } from './collection.controller'
import { LibModule } from '../../lib/lib.module'

@Module({
  imports: [LibModule],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
