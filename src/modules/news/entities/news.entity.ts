import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NewsTranslation } from './news-translation.entity'

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date

  @Column({ type: 'timestamp', nullable: true })
  publishDate: Date

  @Column({ default: false })
  published: boolean

  @OneToMany(() => NewsTranslation, (translation) => translation.news)
  translations: NewsTranslation[]
}
