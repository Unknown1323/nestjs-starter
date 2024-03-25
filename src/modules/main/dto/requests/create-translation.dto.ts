import { IsOptional, IsString } from 'class-validator'

export class CreateTranslationDto {
  @IsString()
  @IsOptional()
  lang: string

  @IsString()
  title?: string

  thumbnailUrl?: string
}
