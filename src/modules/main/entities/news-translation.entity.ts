import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { News } from './news.entity'

@Entity()
export class NewsTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => News, (news) => news.translations)
  news: News

  @Column()
  language: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string
}
