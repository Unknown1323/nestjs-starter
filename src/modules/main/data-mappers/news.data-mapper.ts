import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsTranslation } from 'src/modules/main/entities/news-translation.entity'
import { News } from 'src/modules/main/entities/news.entity'

@Injectable()
export class NewsDataMapper {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(NewsTranslation)
    private readonly translationRepository: Repository<NewsTranslation>,
    @InjectRepository(NewsCategoryTranslation)
    private readonly categorytranslationRepository: Repository<NewsCategoryTranslation>,
  ) {}

  async updateNewsTranslations(news: News, translationList: CreateTranslationDto[]): Promise<void> {
    const updatedTranslations = []

    if (news.translationList) {
      for (const translationData of translationList) {
        const existingTranslation = news.translationList.find((t) => t.lang === translationData.lang)
        if (existingTranslation) {
          await this.translationRepository.update(existingTranslation.id, translationData)
          updatedTranslations.push(existingTranslation)
        } else {
          const newTranslation = await this.translationRepository.create({
            ...translationData,
            news: news,
          })

          await this.translationRepository.save(newTranslation)
          updatedTranslations.push(newTranslation)
        }
      }

      news.translationList = updatedTranslations
    } else {
      console.log('translationList is undefined')
    }
  }

  async createNewsTranslations(news: News, translationList: any[]): Promise<void> {
    const translations = translationList.map((translationData) => ({ ...translationData, news: news }))

    await this.translationRepository.save(translations)
  }

  async mapUpdateDtoToEntities(updateNewsDto: any, translationToUpdate: any): Promise<void> {
    const { newsCategory, translationList, ...newsData } = updateNewsDto

    const translationData = translationList[0]
    let categoryToUpdate = null
    if (newsCategory) {
      const result = await this.categorytranslationRepository.findOne({
        where: { id: newsCategory.id },
        relations: ['category'],
      })

      categoryToUpdate = result?.category
    }

    translationToUpdate.title = translationData.title
    translationToUpdate.description = translationData.description
    translationToUpdate.thumbnailUrl = translationData.thumbnailUrl
    translationToUpdate.htmlText = translationData.contentData.htmlText
    translationToUpdate.metaTitle = translationData.metaData.title
    translationToUpdate.metaDescription = translationData.metaData.description
    translationToUpdate.metaKeywords = translationData.metaData.keywords
    translationToUpdate.ogTitle = translationData.metaData.ogTitle
    translationToUpdate.ogDescription = translationData.metaData.ogDescription
    translationToUpdate.ogImage = translationData.metaData.ogImageUrl

    const { news } = translationToUpdate

    news.updatedAt = news.updatedAt
    news.publishedAt = newsData.publishedAt
    news.isPublished = true
    news.newsCategory = categoryToUpdate
  }
}
