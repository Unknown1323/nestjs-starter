import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateCategoryNewsDto } from 'src/modules/main/dto/requests/create-news-category.dto'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsCategory } from 'src/modules/main/entities/news-category.entity'

import { CategoryDataMapper } from 'src/modules/main/data-mappers/news-category.data-mapper'

@Injectable()
export class NewsCategoryService {
  constructor(
    private readonly newsDataMapper: CategoryDataMapper,
    @InjectRepository(NewsCategory)
    private categoryRepository: Repository<NewsCategory>,
    @InjectRepository(NewsCategoryTranslation)
    private translationRepository: Repository<NewsCategoryTranslation>,
  ) {}

  async findAll(startIndex = 0, endIndex = 10): Promise<{ categories: NewsCategory[]; total: number }> {
    const correctedStartIndex = Math.max(startIndex - 1, 0)
    const categories = await this.categoryRepository.find({
      relations: ['translationList'],
      skip: correctedStartIndex,
      take: endIndex - correctedStartIndex,
    })
    const total = await this.categoryRepository.count()

    return { categories, total }
  }

  async findOne(id: string): Promise<any> {
    const result = await this.translationRepository.findOne({
      where: { id },
      relations: ['category'],
    })
    if (result) {
      const transformedResult = {
        id: result.category.id,
        publishedAt: result.category.publishedAt,
        createdAt: result.category.createdAt,
        updatedAt: result.category.updatedAt,
        translationList: [
          {
            id: result.id,
            lang: result.lang,
            title: result.title,
          },
        ],
      }

      return transformedResult
    } else {
      return null
    }
  }

  async create(categoryNewsDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    return await this.newsDataMapper.createCategoryWithTranslations(categoryNewsDto)
  }

  async update(id: string, updateCategoryDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    return await this.newsDataMapper.updateCategoryWithTranslations(id, updateCategoryDto)
  }

  async remove(id: string): Promise<NewsCategoryTranslation> {
    const translationToRemove = await this.translationRepository.findOne({
      where: { id },
    })

    if (!translationToRemove) {
      throw new NotFoundException(`Category${id} not found`)
    }

    return this.translationRepository.remove(translationToRemove)
  }
}
