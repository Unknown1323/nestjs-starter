import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from './news-category.entity'
import { NewsTranslation } from './news-translation.entity'

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date

  @Column({ type: 'timestamp', nullable: true })
  publishDate: Date

  @Column({ default: 'uk' })
  language: string

  @Column({ default: false })
  published: boolean

  @Column()
  categoryId: string

  @OneToMany(() => NewsTranslation, (translation) => translation.news)
  translations: NewsTranslation[]

  @ManyToOne(() => NewsCategory, (category) => category.news)
  category: NewsCategory
}
