export class TransformedResultDto {
  id: string

  publishedAt: Date

  createdAt: Date

  updatedAt: Date

  translationList: TranslationDto[]
}

export class TranslationDto {
  id: string

  lang: string

  title: string
}
