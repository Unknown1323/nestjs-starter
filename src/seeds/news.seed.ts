import { Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { Command } from 'nestjs-command'
import { EntityManager } from 'typeorm'

import { CategoryTranslation } from 'src/modules/main/entities/category-translation.entity'
import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { NewsTranslation } from 'src/modules/main/entities/news-translation.entity'
import { News } from 'src/modules/main/entities/news.entity'

@Injectable()
export class NewsSeedService {
  constructor(private readonly entityManager: EntityManager) {}

  @Command({ command: 'db:seed:data', describe: 'Seed data' })
  async seedNews(): Promise<void> {
    const categories = await this.entityManager.save(NewsCategory, [
      { id: 'b1d92a48-7a7e-4dc7-80f1-8ad3df1829f4', language: 'uk', createdAt: moment().toISOString() },
      { id: 'c2a6d13d-6f36-4a49-bdcd-89394e045ab5', language: 'eng', createdAt: moment().toISOString() },
    ])

    const news = await this.entityManager.save(News, [
      {
        id: 'f4d3e4c8-d7a9-4d4f-b41e-6d3fa6d25b5d',
        createdDate: moment().toISOString(),
        publishDate: moment().toISOString(),
        language: 'uk',
        published: true,
        categoryId: categories[0].id,
      },
      {
        id: 'fc857365-0b1c-4580-8cc7-90e92b3e529f',
        createdDate: moment().toISOString(),
        publishDate: moment().toISOString(),
        language: 'uk',
        published: true,
        categoryId: categories[1].id,
      },
    ])

    const newsTranslations = await this.entityManager.save(NewsTranslation, [
      {
        news: news[0],
        language: 'eng',
        title: 'Sports title',
        description: 'Description of the Policy',
      },
      {
        news: news[0],
        language: 'uk',
        title: 'Титул Спорту',
        description: 'Опис Спорту',
      },
      {
        news: news[1],
        language: 'eng',
        title: 'Title Culture',
        description: 'Description of the Policy',
      },
      {
        news: news[1],
        language: 'uk',
        title: 'Титул Культура',
        description: 'Опис Культура',
      },
    ])

    const categorysTranslations = await this.entityManager.save(CategoryTranslation, [
      {
        category: categories[0],
        language: 'uk',
        title: 'Культура',
      },
      {
        category: categories[1],
        language: 'eng',
        title: 'Sport',
      },
    ])

    await this.entityManager.save(NewsCategory, categories)
    await this.entityManager.save(News, news)
    await this.entityManager.save(NewsTranslation, newsTranslations)
    await this.entityManager.save(CategoryTranslation, categorysTranslations)
  }
}
