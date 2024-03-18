import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectEntity } from 'src/modules/main/entities/project.entity'

import { AppController } from 'src/modules/main/controllers/app.controller'
import { ProjectController } from 'src/modules/main/controllers/project.controller'

import { ProjectService } from 'src/modules/main/services/project.service'

import { ProjectDataMapper } from 'src/modules/main/data-mappers/project.data-mapper'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), ScheduleModule.forRoot()],
  controllers: [AppController, ProjectController],
  providers: [ProjectService, ProjectDataMapper],
})
export class MainModule {}
