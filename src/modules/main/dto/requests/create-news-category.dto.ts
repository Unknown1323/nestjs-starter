import { Type } from 'class-transformer'
import { IsBoolean, ValidateNested } from 'class-validator'

import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

export class CreateCategoryNewsDto {
  @IsBoolean()
  publishedAt: boolean

  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  translationList: CreateTranslationDto[]
}
