import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategoryTranslation } from 'src/modules/main/entities/news-category-translation.entity'
import { News } from 'src/modules/main/entities/news.entity'

@Entity()
export class NewsCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: false })
  publishedAt: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @OneToMany(() => NewsCategoryTranslation, (translation) => translation.category)
  translationList: NewsCategoryTranslation[]

  @OneToMany(() => News, (news) => news.newsCategory)
  news: News[]
}
