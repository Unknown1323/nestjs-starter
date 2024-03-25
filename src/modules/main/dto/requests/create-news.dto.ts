import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  slug: string

  @IsString()
  @IsOptional()
  newsCategoryId: string

  @IsString()
  @IsOptional()
  thumbnailUrl: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  translationList: CreateTranslationDto[]
}
