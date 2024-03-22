import { Type } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

import { CreateTranslationDto } from 'src/modules/main/dto/requests/create-translation.dto'

export class CreateNewsDto {
  @IsBoolean()
  publishedAt: boolean

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
