import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

import { CreateCategoryNewsDto } from 'src/modules/main/dto/requests/create-news-category.dto'

import { UpdateNewsCategoryDto } from 'src/modules/main/dto/requests/update-news-category.dto'

@Injectable()
export class CategoryDataMapper {
  constructor(
    @InjectRepository(NewsCategory)
    private categoryRepository: Repository<NewsCategory>,
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  async createCategoryWithTranslations(categoryNewsDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    const { publishedAt, translationList } = categoryNewsDto

    const newsCategory = new NewsCategory()

    newsCategory.publishedAt = publishedAt
    const createdCategory = await this.categoryRepository.save(newsCategory)

    await this.createTranslations(createdCategory, translationList)

    return createdCategory
  }

  async updateCategoryWithTranslations(id: string, updateCategoryDto: UpdateNewsCategoryDto): Promise<NewsCategory> {
    try {
      const { translationList, ...categoryData } = updateCategoryDto
      const categoryId = { ...categoryData }
      const category = await this.categoryRepository.findOneOrFail({
        where: { id },
        relations: ['translationList'],
      })

      // Оновлення даних категорії
      await this.categoryRepository.update(id, categoryData)

      const updatedTranslations = []

      for (const translationData of translationList) {
        const existingTranslation = category.translationList.find((t) => t.lang === translationData.lang)

        if (existingTranslation) {
          existingTranslation.title = translationData.title
          existingTranslation.description = translationData.description
          await this.translationRepository.save(existingTranslation)
          updatedTranslations.push(existingTranslation)
        } else {
          const newTranslation = this.translationRepository.create({
            ...translationData,
            category: category,
          })

          updatedTranslations.push(newTranslation)
        }
      }

      category.translationList = updatedTranslations

      // Оновлення екземпляру категорії у базі даних
      const updatedCategory = await this.categoryRepository.save(category)

      return updatedCategory
    } catch (error: any) {
      throw new HttpException(`Failed to update category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private async createTranslations(category: NewsCategory, translationList: any[]): Promise<void> {
    await Promise.all(
      translationList.map(async (translationDto) => {
        const { lang, title, description } = translationDto
        const translation = new Translation()
        translation.lang = lang
        translation.title = title
        translation.description = description
        translation.category = category
        await this.translationRepository.save(translation)
      }),
    )
  }
}
