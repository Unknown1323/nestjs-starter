import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'

import { CreateCategoryNewsDto } from 'src/modules/main/dto/requests/create-news-category.dto'
import { UpdateNewsCategoryDto } from 'src/modules/main/dto/requests/update-news-category.dto'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { NewsCategory } from 'src/modules/main/entities/news-category.entity'

import { NewsCategoryService } from 'src/modules/main/services/category.service'

@Controller('news-category')
export class CategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Get('/list')
  async findAll(
    @Query('startIndex') startIndex?: number,
    @Query('endIndex') endIndex?: number,
  ): Promise<{ data: NewsCategory[]; meta: { total: number } }> {
    const { categories, total } = await this.newsCategoryService.findAll(startIndex, endIndex)

    return { data: categories, meta: { total } }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const category = await this.newsCategoryService.findOne(id)
      const responseData = { data: category }

      res.status(HttpStatus.OK).json(responseData)
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
  }

  @Get('/reference')
  async getReference(): Promise<{ data: NewsCategory[] }> {
    const { categories } = await this.newsCategoryService.findAll()

    return { data: categories }
  }

  @Post('/item')
  @UsePipes(ValidationPipe)
  async create(@Body() createCategoryNewsDto: CreateCategoryNewsDto, @Res() res: Response): Promise<void> {
    try {
      const category = await this.newsCategoryService.create(createCategoryNewsDto)

      res.status(HttpStatus.CREATED).json(category)
    } catch (error) {
      throw new NotFoundException(`Failed to create category: ${error}`)
    }
  }

  @Put('/item/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateNewsCategoryDto: UpdateNewsCategoryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const category = await this.newsCategoryService.update(id, updateNewsCategoryDto)

      res.status(HttpStatus.OK).json(category)
    } catch (error) {
      throw new NotFoundException(`Failed to update category: ${error}`)
    }
  }

  @Delete('/item/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<NewsCategoryTranslation> {
    try {
      return await this.newsCategoryService.remove(id)
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }
  }
}
