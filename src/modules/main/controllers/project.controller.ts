import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ProjectToItemBySlug, ProjectToListItem } from 'src/modules/main/interfaces/project'

import { ProjectService } from 'src/modules/main/services/project.service'

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('list')
  async getList(): Promise<{ data: ProjectToListItem[] }> {
    return await this.projectService.getList()
  }

  @Get('item/:slug')
  async getItem(@Param('slug') slug: string): Promise<{ data: ProjectToItemBySlug }> {
    return await this.projectService.getItemBySlug(slug)
  }
}
