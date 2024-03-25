import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsEnum, IsInt, ValidateIf } from 'class-validator'

export enum AppealType {
  Join = 'join',
  Revalidation = 'revalidation',
}

export class CreateAppealDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string

  @ApiProperty()
  @IsDateString({}, { message: 'Невірний формат дати finishedAt' })
  finishedAt: Date

  @ApiProperty({ enum: AppealType, enumName: 'AppealType' })
  @IsEnum(AppealType, { message: 'Недопустиме значення для поля type' })
  type: AppealType

  @ApiProperty()
  @ValidateIf((o) => typeof o.ipn === 'string')
  @IsInt({ message: 'Невірне значення для поля ipn' })
  ipn: bigint

  @ApiProperty()
  @IsInt({ message: 'Невірне значення для поля age' })
  age: number
}
