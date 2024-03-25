import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateCategoryNewsDto } from 'src/modules/main/dto/requests/create-news-category.dto'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsCategory } from 'src/modules/main/entities/news-category.entity'

@Injectable()
export class CategoryDataMapper {
  constructor(
    @InjectRepository(NewsCategory)
    private categoryRepository: Repository<NewsCategory>,
    @InjectRepository(NewsCategoryTranslation)
    private translationRepository: Repository<NewsCategoryTranslation>,
  ) {}

  async createCategoryWithTranslations(categoryNewsDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    const { translationList } = categoryNewsDto

    const newsCategory = new NewsCategory()

    const createdCategory = await this.categoryRepository.save(newsCategory)

    await this.createTranslations(createdCategory, translationList)

    return createdCategory
  }

  async updateCategoryWithTranslations(id: string, updateCategoryDto: any): Promise<any> {
    try {
      const { translationList } = updateCategoryDto
      for (const translationData of translationList) {
        const translationToUpdate = await this.translationRepository.findOneOrFail({
          where: { id: translationData.id },
          relations: ['category'],
        })

        translationToUpdate.title = translationData.title

        const categoryToUpdate = translationToUpdate.category

        categoryToUpdate.updatedAt = new Date()
        categoryToUpdate.publishedAt = true

        const categoryRepository = this.categoryRepository

        await categoryRepository.save(categoryToUpdate)

        await this.translationRepository.save(translationToUpdate)
      }

      return [1]
    } catch (error: any) {
      throw new HttpException(`Failed to update category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private async createTranslations(category: NewsCategory, translationList: any[]): Promise<void> {
    await Promise.all(
      translationList.map(async (translationDto) => {
        const { lang, title, description } = translationDto
        const translation = new NewsCategoryTranslation()

        translation.lang = lang
        translation.title = title
        translation.category = category
        await this.translationRepository.save(translation)
      }),
    )
  }
}
