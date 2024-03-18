import { constructDto } from 'src/core/inc/functions'

export abstract class GenericDto {
  constructor(data: unknown) {
    Object.assign(this, constructDto(this, data))
  }
}
