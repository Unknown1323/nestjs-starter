import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { News } from './news.entity'

@Entity()
export class NewsTranslation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  language: string

  @Column()
  title: string

  @Column()
  description: string

  @ManyToOne(() => News, (news) => news.translations)
  news: News
}
