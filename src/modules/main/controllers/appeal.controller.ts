import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'

import { CreateAppealDto } from 'src/modules/main/dto/requests/create-appeal.dto'

import { AppealService } from 'src/modules/main/services/appeal.service'

@Controller()
export class AppealController {
  constructor(private readonly appService: AppealService) {}

  @Post('/appeal/create')
  async createAppeal(@Body() body: CreateAppealDto): Promise<{ message: string }> {
    try {
      await this.appService.createAppeal(body)

      return { message: 'Запис успішно створено' }
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
