import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { NewsCategory as interfaceNewsCategory } from 'src/modules/main/interfaces/news-category.interface'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(NewsCategory)
    private readonly newsCategoryRepository: Repository<NewsCategory>,
  ) {}

  async findAll(): Promise<interfaceNewsCategory[]> {
    const query = await this.newsCategoryRepository
      .createQueryBuilder('newsCategory')
      .innerJoinAndSelect('newsCategory.translations', 'categoryTranslation')
      .where('categoryTranslation.language = newsCategory.language')

    const newsResult = await query.getMany()
    const formattedCategory = newsResult.map((category) => ({
      id: category.id,
      createdAt: category.createdAt,
      language: category.language,
      title: category.translations.find((translation) => translation.language === category.language)?.title || '',
    }))

    return formattedCategory
  }

  async findOne(id: string): Promise<interfaceNewsCategory> {
    const query = await this.newsCategoryRepository
      .createQueryBuilder('newsCategory')
      .innerJoinAndSelect('newsCategory.translations', 'categoryTranslation')
      .where('categoryTranslation.language = newsCategory.language')
      .andWhere('newsCategory.id = :id', { id })
      .getOne()

    if (!query) {
      throw new NotFoundException('Category not found')
    }

    const formattedCategory = {
      id: query.id,
      createdAt: query.createdAt,
      language: query.language,
      title: query.translations.find((translation) => translation.language === query.language)?.title || '',
    }

    return formattedCategory
  }
}
