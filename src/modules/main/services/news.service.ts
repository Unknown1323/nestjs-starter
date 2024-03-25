import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateNewsDto } from 'src/modules/main/dto/requests/create-news.dto'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsTranslation } from 'src/modules/main/entities/news-translation.entity'
import { News } from 'src/modules/main/entities/news.entity'

import { NewsDataMapper } from 'src/modules/main/data-mappers/news.data-mapper'

@Injectable()
export class NewsService {
  constructor(
    private readonly newsDataMapper: NewsDataMapper,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(NewsTranslation)
    private readonly translationRepository: Repository<NewsTranslation>,
    @InjectRepository(NewsCategoryTranslation)
    private readonly categorytranslationRepository: Repository<NewsCategoryTranslation>,
  ) {}

  async findAll(
    searchTerm?: string,
    publishedBefore?: Date,
    publishedAfter?: Date,
    newsCategory?: string,
    sortColumn = 'id',
    sortDirection = 'ASC',
    startIndex = 1,
    endIndex = 10,
    totalRecords?: number,
    lang?: string,
  ): Promise<any> {
    try {
      const query = this.newsRepository
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.translationList', 'translation')
        .leftJoin('news.newsCategory', 'category')
        .leftJoin('category.translationList', 'categoryTranslation', 'categoryTranslation.lang = :lang', { lang })
        .select([
          'news.id',
          'news.isPublished',
          'news.slug',
          'news.thumbnailUrl',
          'news.publishedAt',
          'news.createdAt',
          'news.updatedAt',
          'translation',
          'category.id',
          'categoryTranslation',
          'category',
        ])

      if (sortColumn === 'title') {
        query.orderBy(`translationList.${sortColumn}`, sortDirection as 'ASC' | 'DESC')
      } else if (sortColumn === 'newsCategory') {
        query.orderBy(`translationList[0].title`, sortDirection as 'ASC' | 'DESC')
      } else if (sortDirection && (sortDirection.toUpperCase() === 'ASC' || sortDirection.toUpperCase() === 'DESC')) {
        query.orderBy(`news.${sortColumn}`, sortDirection as 'ASC' | 'DESC')
      } else {
        query.orderBy(`news.id`, 'ASC')
      }

      if (searchTerm) {
        query.andWhere('translation.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      }

      if (publishedBefore) {
        query.andWhere('news.publishDate <= :publishedBefore', { publishedBefore })
      }

      if (publishedAfter) {
        query.andWhere('news.publishDate >= :publishedAfter', { publishedAfter })
      }

      if (newsCategory) {
        query.andWhere('categoryTranslation.id = :newsCategory', { newsCategory })
      }

      if (lang) {
        query.andWhere('translation.lang = :lang', { lang })
      }

      const total = await query.getCount()
      const newsList = await query
        .skip(startIndex - 1)
        .take(endIndex - startIndex + 1)
        .getMany()

      return { data: newsList, total }
    } catch (error: any) {
      throw new NotFoundException(`Failed to find news: ${error}`)
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const news = await this.translationRepository
        .createQueryBuilder('translation')
        .leftJoinAndSelect('translation.news', 'news')
        .leftJoinAndSelect('news.newsCategory', 'newsCategory')
        .leftJoinAndSelect(
          'newsCategory.translationList',
          'categoryTranslation',
          'categoryTranslation.lang = translation.lang',
        )
        .leftJoinAndSelect('newsCategory.translationList', 'translationList')
        .where('translation.id = :id', { id })
        .getOne()

      if (!news) {
        throw new NotFoundException('News not found')
      }

      const transformedResult = {
        id: news.news.id,
        createdAt: news.news.createdAt,
        updatedAt: news.news.updatedAt,
        slug: news.news.slug,
        publishedAt: news.news.publishedAt,
        translationList: [
          {
            id: news.id,
            lang: news.lang,
            title: news.title,
            description: news.description,
            thumbnailUrl: news.thumbnailUrl,
            publishedAt: news.news.publishedAt,
            metaData: {
              title: news.metaDescription,
              description: news.metaDescription,
              keywords: news.metaKeywords,
              ogTitle: news.ogTitle,
              ogDescription: news.ogDescription,
              ogImageUrl: news.ogImage,
            },
            contentData: {
              htmlText: news.htmlText,
            },
          },
        ],
        newsCategory:
          news.news.newsCategory?.translationList.find((translation) => translation.lang === news.lang) ??
          news.news.newsCategory,
      }

      return transformedResult
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

  async update(newsId: string, updateNewsDto): Promise<any> {
    try {
      const { newsCategory, translationList, ...newsData } = updateNewsDto

      const translationToUpdate = await this.translationRepository
        .createQueryBuilder('translation')
        .leftJoinAndSelect('translation.news', 'news')
        .leftJoinAndSelect('news.newsCategory', 'category')
        .where('translation.id = :id', { id: newsId })
        .getOneOrFail()
      const { news } = translationToUpdate

      let categoryToUpdate = null
      if (newsCategory) {
        const result = await this.categorytranslationRepository.findOne({
          where: { id: newsCategory.id },
          relations: ['category'],
        })

        categoryToUpdate = result?.category
      }

      const translationData = translationList[0]

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

      news.updatedAt = news.updatedAt
      news.publishedAt = newsData.publishedAt
      news.isPublished = true
      news.newsCategory = categoryToUpdate
      const updateNew = await this.newsRepository.save(news)
      const updatedTranslations = await this.translationRepository.save(translationToUpdate)

      return [updateNew, updatedTranslations]
    } catch (error) {
      throw new NotFoundException(`Failed to update news: ${error}`)
    }
  }

  async delete(id: string): Promise<NewsTranslation> {
    const newsToRemove = await this.translationRepository.findOne({
      where: { id },
    })

    if (!newsToRemove) {
      throw new NotFoundException(`News ${id} not found`)
    }

    return await this.translationRepository.remove(newsToRemove)
  }
}
