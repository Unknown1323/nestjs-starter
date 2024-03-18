import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import { CommandModule } from 'nestjs-command'

import { DatabaseNamingStrategy } from 'src/db/database-naming.strategy'

import { MainModule } from 'src/modules/main/main.module'
import { NewsModule } from './modules/news/news.module'

dotenv.config({ path: '.env.workspace' })

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
      logging: false,
      namingStrategy: new DatabaseNamingStrategy(),
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/**/migrations/*{.js,.ts}`],
    }),
    CommandModule,
    MainModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
