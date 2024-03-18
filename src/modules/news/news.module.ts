import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NewsController } from './controllers/news.controller'
import { News } from './entities/news.entity'
import { NewsService } from './services/news.service'

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
