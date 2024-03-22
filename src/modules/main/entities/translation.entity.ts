import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { News } from 'src/modules/main/entities/news.entity'

@Entity()
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => News, (news) => news.translationList, { nullable: true })
  news: News

  @ManyToOne(() => NewsCategory, (category) => category.translationList, { nullable: true })
  category: NewsCategory

  @Column()
  lang: string

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  thumbnailUrl: string
}
