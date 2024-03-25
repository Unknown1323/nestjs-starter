import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common'

import { CreateNewsDto } from 'src/modules/main/dto/requests/create-news.dto'
import { UpdateNewsDto } from 'src/modules/main/dto/requests/update-news.dto'

import { News } from 'src/modules/main/entities/news.entity'

import { NewsService } from 'src/modules/main/services/news.service'

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/list')
  async findAll(
    @Query('searchTerm') searchTerm?: string,
    @Query('publishedBefore') publishedBefore?: Date,
    @Query('publishedAfter') publishedAfter?: Date,
    @Query('newsCategory') newsCategory?: string,
    @Query('page') page?: number,
    @Query('sortColumn') sortColumn?: string,
    @Query('sortDirection') sortDirection?: string,
    @Query('startIndex') startIndex?: number,
    @Query('endIndex') endIndex?: number,
    @Query('totalRecords') totalRecords?: number,
    @Query('lang') lang?: string,
  ): Promise<{ data: News[]; meta: { total: number } }> {
    try {
      const newsData = await this.newsService.findAll(
        searchTerm,
        publishedBefore,
        publishedAfter,
        newsCategory,
        sortColumn,
        sortDirection,
        startIndex,
        endIndex,
        totalRecords,
        lang,
      )

      return { data: newsData.data, meta: { total: newsData.total } }
    } catch (error) {
      throw new HttpException('Failed to fetch news', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/item/:id')
  async findOne(@Param('id') id: string): Promise<{ data: News[] }> {
    try {
      const news = await this.newsService.findOne(id)

      return { data: news }
    } catch (error) {
      throw new HttpException('News not found', HttpStatus.NOT_FOUND)
    }
  }

  @Post('/item')
  async create(@Body(new ValidationPipe()) createNewsDto: CreateNewsDto): Promise<News> {
    try {
      const createdNews = await this.newsService.create(createNewsDto)

      return createdNews
    } catch (error) {
      throw new HttpException('Failed to create news1', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Put('/item/:id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateNewsDto: UpdateNewsDto,
  ): Promise<UpdateNewsDto> {
    try {
      const updatedNews = await this.newsService.update(id, updateNewsDto)

      return updatedNews
    } catch (error) {
      throw new HttpException('Failed to update news1', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete('/item/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      await this.newsService.delete(id)

      return [{ data: {} }]
    } catch (error) {
      throw new HttpException('Failed to delete news', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
