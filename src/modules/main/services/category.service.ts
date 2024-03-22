import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateCategoryNewsDto } from 'src/modules/main/dto/requests/create-news-category.dto'
import { UpdateNewsCategoryDto } from 'src/modules/main/dto/requests/update-news-category.dto'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

import { CategoryDataMapper } from 'src/modules/main/data-mappers/news-category.data-mapper'

@Injectable()
export class NewsCategoryService {
  constructor(
    private readonly newsDataMapper: CategoryDataMapper,
    @InjectRepository(NewsCategory)
    private categoryRepository: Repository<NewsCategory>,
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  async findAll(): Promise<NewsCategory[]> {
    return await this.categoryRepository.find({ relations: ['translationList'] })
  }

  async findOne(id: string): Promise<any> {
    const translation = await this.translationRepository.findOne({ where: { id }, relations: ['category'] })

    if (!translation) {
      return null
    }
    const category = translation.category
    const data = {
      id: translation.id,
      publishedAt: category.publishedAt,
      categoryId: category.id,
      title: translation.title,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      translationList: [
        {
          lang: translation.lang,
          title: translation.title,
          description: translation.description,
          thumbnailUrl: translation.thumbnailUrl,
        },
      ],
    }

    return data
  }

  async create(categoryNewsDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    return await this.newsDataMapper.createCategoryWithTranslations(categoryNewsDto)
  }

  async update(id: string, updateCategoryDto: CreateCategoryNewsDto): Promise<NewsCategory> {
    return await this.newsDataMapper.updateCategoryWithTranslations(id, updateCategoryDto)
  }

  async remove(id: string): Promise<void> {
    const categoryToRemove = await this.categoryRepository.findOne({
      where: { id },
      relations: ['translationList'],
    })

    if (!categoryToRemove) {
      throw new NotFoundException(`Category${id} not found`)
    }

    await Promise.all(
      categoryToRemove.translationList.map(async (translation) => {
        await this.translationRepository.remove(translation)
      }),
    )

    await this.categoryRepository.remove(categoryToRemove)
  }
}
