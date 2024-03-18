import { Injectable } from '@nestjs/common'

import { ProjectToItemBySlug, ProjectToListItem } from 'src/modules/main/interfaces/project'

import { ProjectEntity } from 'src/modules/main/entities/project.entity'

@Injectable()
export class ProjectDataMapper {
  projectToSearchResult(entity: ProjectEntity): ProjectToListItem {
    const { thumbnailUrl, slug } = entity

    return {
      thumbnailUrl,
      slug,
    }
  }

  projectGetBySlug(entity: ProjectEntity): ProjectToItemBySlug {
    const { thumbnailUrl, slug } = entity

    return {
      thumbnailUrl,
      slug,
    }
  }
}
