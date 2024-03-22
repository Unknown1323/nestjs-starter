import { Injectable } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { EntityManager } from 'typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { News } from 'src/modules/main/entities/news.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

@Injectable()
export class NewsSeedService {
  constructor(private readonly entityManager: EntityManager) {}

  @Command({ command: 'db:seed:data', describe: 'Seed data' })
  async seedNews(): Promise<void> {
    const categories = await this.entityManager.save(NewsCategory, [{ publishedAt: true }, { publishedAt: true }])

    const news = await this.entityManager.save(News, [
      {
        isPublished: true,
        slug: 'slug1',
        thumbnailUrl: 'url1',
      },
      {
        isPublished: true,
        slug: 'slug2',
        thumbnailUrl: 'url2',
      },
    ])

    const translations = await this.entityManager.save(Translation, [
      {
        lang: 'uk',
        title: 'Новина 1',
        description: 'Опис новини 1',
        thumbnailUrl: 'url1',
        news: news[0],
      },
      {
        lang: 'en',
        title: 'News 1',
        description: 'Description of news 1',
        thumbnailUrl: 'url1',
        news: news[0],
      },
      {
        lang: 'uk',
        title: 'Новина 2',
        description: 'Опис новини 2',
        thumbnailUrl: 'url2',
        news: news[1],
      },
      {
        lang: 'en',
        title: 'News 2',
        description: 'Description of news 2',
        thumbnailUrl: 'url2',
        news: news[1],
      },
    ])

    await this.entityManager.save(NewsCategory, categories)
    await this.entityManager.save(News, news)
    await this.entityManager.save(Translation, translations)
  }
}
