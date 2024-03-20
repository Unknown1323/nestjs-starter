import { Controller, Get, Param, Query } from '@nestjs/common'

import { News as interfaceNews } from 'src/modules/main/interfaces/news.interface'

import { NewsService } from 'src/modules/main/services/news.service'

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('searchTerm') searchTerm?: string,
    @Query('publishedBefore') publishedBefore?: Date,
    @Query('publishedAfter') publishedAfter?: Date,
    @Query('newsCategory') newsCategory?: string,
  ): Promise<interfaceNews[]> {
    return await this.newsService.getNews(searchTerm, publishedBefore, publishedAfter, newsCategory)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<interfaceNews> {
    return await this.newsService.findOne(id)
  }
}
