import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { News } from 'src/modules/news/entities/news.entity'

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return await this.newsRepository.find({ where: { published: true } })
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
    })
    if (!news) {
      throw new NotFoundException('News not found')
    }

    if (!news.published) {
      throw new NotFoundException('News is not published')
    }

    return news
  }
}
