import { IsOptional, IsString } from 'class-validator'

export class CreateTranslationDto {
  @IsString()
  @IsOptional()
  lang: string

  @IsString()
  title?: string

  @IsString()
  description?: string

  thumbnailUrl?: string
}
