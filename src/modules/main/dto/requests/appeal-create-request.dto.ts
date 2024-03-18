import { Expose } from 'class-transformer'
import { IsEmail, IsOptional, IsString } from 'class-validator'

import { GenericDto } from 'src/core/abstracts/generic.dto'

export class AppealCreateRequestDto extends GenericDto {
  @IsEmail()
  @Expose()
  email: string

  @Expose()
  @IsString()
  @IsOptional()
  fullName?: string

  @Expose()
  @IsString()
  @IsOptional()
  ideaText?: string
}
