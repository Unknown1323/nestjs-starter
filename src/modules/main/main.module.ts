import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { News } from './entities/news.entity'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { ProjectEntity } from 'src/modules/main/entities/project.entity'

import { AppController } from 'src/modules/main/controllers/app.controller'
import { CategoryController } from 'src/modules/main/controllers/category.controller'
import { NewsController } from 'src/modules/main/controllers/news.controller'
import { ProjectController } from 'src/modules/main/controllers/project.controller'

import { CategoryService } from 'src/modules/main/services/category.service'
import { NewsService } from 'src/modules/main/services/news.service'
import { ProjectService } from 'src/modules/main/services/project.service'

import { ProjectDataMapper } from 'src/modules/main/data-mappers/project.data-mapper'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, News, NewsCategory]), ScheduleModule.forRoot()],
  controllers: [AppController, NewsController, CategoryController, ProjectController],
  providers: [NewsService, CategoryService, ProjectService, ProjectDataMapper],
})
export class MainModule {}
