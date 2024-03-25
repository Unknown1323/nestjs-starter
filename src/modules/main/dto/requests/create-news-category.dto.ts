import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

export class CreateCategoryNewsDto {
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  translationList: CreateTranslationDto[]
}
