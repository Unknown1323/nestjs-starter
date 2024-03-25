import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { News } from './entities/news.entity'

import { Appeal } from 'src/modules/main/entities/appeal.entity'
import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { NewsTranslation } from 'src/modules/main/entities/news-translation.entity'
import { ProjectEntity } from 'src/modules/main/entities/project.entity'

import { AppController } from 'src/modules/main/controllers/app.controller'
import { AppealController } from 'src/modules/main/controllers/appeal.controller'
import { CategoryController } from 'src/modules/main/controllers/category.controller'
import { NewsController } from 'src/modules/main/controllers/news.controller'
import { ProjectController } from 'src/modules/main/controllers/project.controller'

import { AppealService } from 'src/modules/main/services/appeal.service'
import { NewsCategoryService } from 'src/modules/main/services/category.service'
import { NewsService } from 'src/modules/main/services/news.service'
import { ProjectService } from 'src/modules/main/services/project.service'

import { CategoryDataMapper } from 'src/modules/main/data-mappers/news-category.data-mapper'
import { NewsDataMapper } from 'src/modules/main/data-mappers/news.data-mapper'
import { ProjectDataMapper } from 'src/modules/main/data-mappers/project.data-mapper'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, News, NewsCategory, NewsTranslation, NewsCategoryTranslation, Appeal]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, CategoryController, NewsController, ProjectController, AppealController],
  providers: [
    NewsCategoryService,
    NewsService,
    ProjectService,
    AppealService,
    ProjectDataMapper,
    NewsDataMapper,
    CategoryDataMapper,
  ],
})
export class MainModule {}
