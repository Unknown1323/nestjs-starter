import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { News } from 'src/modules/main/entities/news.entity'

@Entity()
export class NewsTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => News, (news) => news.translationList, { nullable: true })
  news: News

  @Column()
  lang: string

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  thumbnailUrl: string

  @Column({ type: 'text', nullable: true })
  htmlText: string

  @Column({ nullable: true })
  metaTitle: string

  @Column({ nullable: true })
  metaDescription: string

  @Column({ type: 'text', nullable: true })
  metaKeywords: string

  @Column({ nullable: true })
  ogTitle: string

  @Column({ nullable: true })
  ogDescription: string

  @Column({ nullable: true })
  ogImage: string
}
