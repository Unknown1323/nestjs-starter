import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { News } from 'src/modules/main/entities//news.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

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

  @OneToMany(() => Translation, (translation) => translation.category)
  translationList: Translation[]

  @OneToMany(() => News, (news) => news.newsCategory)
  news: News[]
}
