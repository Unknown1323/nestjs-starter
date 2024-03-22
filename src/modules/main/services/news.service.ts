import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { News } from 'src/modules/main/entities/news.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

import { NewsDataMapper } from 'src/modules/main/data-mappers/news.data-mapper'

import { CreateNewsDto } from 'src/modules/main/dto/requests/create-news.dto'

@Injectable()
export class NewsService {
  constructor(
    private readonly newsDataMapper: NewsDataMapper,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Translation)
    private readonly translationRepository: Repository<Translation>,
  ) {}

  async findAll(
    searchTerm?: string,
    publishedBefore?: Date,
    publishedAfter?: Date,
    newsCategory?: string,
    sortColumn?: string,
    sortDirection?: string,
    startIndex?: number,
    endIndex?: number,
    totalRecords?: number,
    lang?: string,
  ): Promise<any> {
    try {
      let query = this.newsRepository
        .createQueryBuilder('news')
        .addSelect('news.newsCategoryId')
        .leftJoinAndSelect('news.translationList', 'translation')

      if (searchTerm) {
        query = query.where('translation.title ILIKE :searchTerm OR translation.title ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
      }

      if (publishedBefore) {
        query = query.andWhere('news.publishDate <= :publishedBefore', { publishedBefore })
      }

      if (publishedAfter) {
        query = query.andWhere('news.publishDate >= :publishedAfter', { publishedAfter })
      }

      if (newsCategory) {
        query = query
          .innerJoin('news.newsCategory', 'category')
          .andWhere('category.id = :newsCategory', { newsCategory })
      }

      if (startIndex !== undefined && endIndex !== undefined) {
        query = query.skip(startIndex).take(endIndex - startIndex + 1)
      }

      if (lang) {
        query = query.innerJoinAndSelect(
          'news.translationList',
          'filteredTranslation',
          'filteredTranslation.newsId = news.id AND filteredTranslation.lang = :lang',
          { lang },
        )
      }
      await query.getMany()

      const newsList = await query.getMany()

      const updatedNewsList = await Promise.all(
        newsList.map(async (news) => {
          const categoryTranslation = await this.translationRepository
            .createQueryBuilder('translation')
            .innerJoinAndSelect('translation.category', 'category')
            .where('category.id = :categoryId', { categoryId: news.newsCategoryId })
            .andWhere('translation.lang = :lang', { lang })
            .getOne()

          const newsCategory = categoryTranslation ? categoryTranslation.title : null

          return { ...news, newsCategory }
        }),
      )

      return updatedNewsList
    } catch (error) {
      throw new NotFoundException(`Failed to find news: ${error}`)
    }
  }

  async findOne(id: string): Promise<News> {
    try {
      const news = await this.newsRepository.findOne({
        where: { id, publishedAt: true },
        relations: ['translationList'],
      })
      if (!news) {
        throw new NotFoundException('News not found')
      }

      return news
    } catch (error) {
      throw new NotFoundException(`Failed to find news: ${error}`)
    }
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    try {
      const { translationList, ...newsData } = createNewsDto

      const news = this.newsRepository.create(newsData)
      const savedNews = await this.newsRepository.save(news)

      await this.newsDataMapper.createNewsTranslations(savedNews, translationList)

      return savedNews
    } catch (error: any) {
      throw new NotFoundException(`Failed to create news: ${error}`)
    }
  }

  async update(newsId: string, updateNewsDto): Promise<News> {
    try {
      const { translationList, ...newsData } = updateNewsDto

      const news = await this.newsRepository.findOne({ where: { id: newsId }, relations: ['translationList'] })
      if (!news) {
        throw new NotFoundException(`News with newsId ${newsId} not found`)
      }

      await this.newsRepository.update(news.id, newsData)
      await this.newsDataMapper.updateNewsTranslations(news, translationList)

      return news
    } catch (error) {
      throw new NotFoundException(`Failed to update news: ${error}`)
    }
  }

  async delete(id: string): Promise<void> {
    const newsToRemove = await this.newsRepository.findOne({
      where: { id },
      relations: ['translationList'],
    })

    if (!newsToRemove) {
      throw new NotFoundException(`News ${id} not found`)
    }

    await Promise.all(
      newsToRemove.translationList.map(async (translation) => {
        await this.translationRepository.remove(translation)
      }),
    )

    await this.newsRepository.remove(newsToRemove)
  }
}
