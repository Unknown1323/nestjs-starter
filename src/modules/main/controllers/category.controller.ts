import { Controller, Get, Param } from '@nestjs/common'

import { NewsCategory as interfaceNewsCategory } from 'src/modules/main/interfaces/news-category.interface'

import { CategoryService } from 'src/modules/main/services/category.service'

@Controller('category')
export class CategoryController {
  constructor(private readonly newsService: CategoryService) {}

  @Get()
  async getNews(): Promise<interfaceNewsCategory[]> {
    return await this.newsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<interfaceNewsCategory> {
    return await this.newsService.findOne(id)
  }
}
