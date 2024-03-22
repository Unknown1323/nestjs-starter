import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { News } from 'src/modules/main/entities/news.entity' // Убедитесь, что путь указан правильно
import { Translation } from 'src/modules/main/entities/translation.entity' // Убедитесь, что путь указан правильно
import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

@Injectable()
export class NewsDataMapper {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Translation)
    private readonly translationRepository: Repository<Translation>,
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
}
