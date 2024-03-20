import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { CategoryTranslation } from './category-translation.entity'
import { News } from './news.entity'

@Entity()
export class NewsCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: 'uk' })
  language: string

  @OneToMany(() => CategoryTranslation, (translation) => translation.category)
  translations: CategoryTranslation[]

  @OneToMany(() => News, (news) => news.category)
  news: News[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
