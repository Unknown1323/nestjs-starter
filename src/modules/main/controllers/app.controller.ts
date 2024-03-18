import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): { data: string } {
    return { data: 'Hello World!' }
  }
}
