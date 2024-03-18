import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm/repository/Repository'

import { ProjectToItemBySlug, ProjectToListItem } from 'src/modules/main/interfaces/project'

import { ProjectEntity } from 'src/modules/main/entities/project.entity'

import { ProjectDataMapper } from 'src/modules/main/data-mappers/project.data-mapper'

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectDataMapper: ProjectDataMapper,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
  ) {}

  async getList(): Promise<{ data: ProjectToListItem[] }> {
    const projectList = await this.projectRepository.find()

    return { data: projectList.map((project) => this.projectDataMapper.projectToSearchResult(project)) }
  }

  async getItemBySlug(slug: string): Promise<{ data: ProjectToItemBySlug }> {
    const foundItem = await this.projectRepository.findOneOrFail({
      where: {
        slug,
      },
    })

    if (foundItem) {
      return { data: this.projectDataMapper.projectGetBySlug(foundItem) }
    } else {
      throw new NotFoundException()
    }
  }
}
