export class UpdateNewsDto {
  newsCategory?: { id: string } // Ідентифікатор категорії новин
  translationList: {
    title: string
    description: string
    thumbnailUrl: string
    contentData: {
      htmlText: string
    }
    metaData: {
      title: string
      description: string
      keywords: string
      ogTitle: string
      ogDescription: string
      ogImageUrl: string
    }
  }[]
  publishedAt: Date // Дата публікації новини
}
