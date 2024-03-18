import { NestFactory } from '@nestjs/core'
import { CommandModule, CommandService } from 'nestjs-command'

import { AppModule } from 'src/app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  app.select(CommandModule).get(CommandService).exec()
}

bootstrap()
