import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { News as interfaceNews } from 'src/modules/main/interfaces/news.interface'

import { News } from 'src/modules/main/entities/news.entity'

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return await this.newsRepository.find({ where: { published: true }, relations: ['translations'] })
  }

  async getNews(
    searchTerm?: string,
    publishedBefore?: Date,
    publishedAfter?: Date,
    newsCategory?: string,
  ): Promise<interfaceNews[]> {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.translations', 'translation')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('category.translations', 'categoryTranslation')
      .where('news.published = :published', { published: true })

    if (searchTerm) {
      const searchTermParam = `%${searchTerm}%`

      query.andWhere('(translation.title LIKE :searchTerm OR translation.description LIKE :searchTerm)', {
        searchTerm: searchTermParam,
      })
    }

    if (publishedBefore) {
      query.andWhere('news.publishDate <= :publishedBefore', { publishedBefore })
    }

    if (publishedAfter) {
      query.andWhere('news.publishDate >= :publishedAfter', { publishedAfter })
    }

    if (newsCategory) {
      query.andWhere('categoryTranslation.title = :newsCategory', { newsCategory })
    }

    const newsResult = await query.getMany()

    const formattedNews = newsResult.map((news) => ({
      id: news.id,
      createdDate: news.createdDate,
      publishDate: news.publishDate,
      language: news.language,
      title: news.translations.find((translation) => translation.language === news.language)?.title || '',
      description: news.translations.find((translation) => translation.language === news.language)?.description || '',
      categoryName:
        news.category.translations.find((translation) => translation.language === news.language)?.title || '',
    }))

    return formattedNews
  }

  async findOne(id: string): Promise<interfaceNews> {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.translations', 'translation')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('category.translations', 'categoryTranslation')
      .where('news.id = :id', { id })
    const newsResult = await query.getOne()

    if (!newsResult) {
      throw new NotFoundException('News not found')
    }

    if (!newsResult.published) {
      throw new NotFoundException('News is not published')
    }

    let categoryName = ''
    for (const translation of newsResult.category.translations) {
      if (translation.language === newsResult.language) {
        categoryName = translation.title
        break
      }
    }

    const formattedNews = {
      id: newsResult.id,
      createdDate: newsResult.createdDate,
      publishDate: newsResult.publishDate,
      language: newsResult.language,
      title: newsResult.translations.find((translation) => translation.language === newsResult.language)?.title || '',
      description:
        newsResult.translations.find((translation) => translation.language === newsResult.language)?.description || '',
      categoryName: categoryName,
    }

    return formattedNews
  }
}
