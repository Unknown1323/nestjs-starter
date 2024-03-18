import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { News } from '../entities/news.entity'

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
      where: { id, published: true },
    })
    if (!news) {
      throw new NotFoundException('News not found')
    }
    return news
  }
}
