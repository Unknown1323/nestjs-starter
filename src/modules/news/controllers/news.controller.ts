import { Controller, Get, Param } from '@nestjs/common'

import { News } from 'src/modules/news/entities/news.entity'

import { NewsService } from 'src/modules/news/services/news.service'

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
