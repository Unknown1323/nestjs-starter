import { NewsTranslation } from './news-translation.interface'

export interface News {
  id: string
  publishDate: Date
  published: boolean
  translations: NewsTranslation[]
}
