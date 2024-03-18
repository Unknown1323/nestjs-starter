import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { News } from '../entities/news.entity'
import { NewsService } from '../services/news.service'

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(): Promise<News[]> {
    return await this.newsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<News> {
    return await this.newsService.findOne(id)
  }
}
