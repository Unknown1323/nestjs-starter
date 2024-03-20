import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

import { AppModule } from 'src/app.module'

import { AllExceptionFilter } from 'src/core/filters/all-exception.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  app.useGlobalFilters(new AllExceptionFilter())
  dotenv.config()

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: process.env.CORS_ORIGINS.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Starter API')
    .setDescription('')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('swagger', app, document)

  await app.listen(+process.env.PORT)
}

bootstrap()
