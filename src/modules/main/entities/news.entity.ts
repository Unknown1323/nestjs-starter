import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { NewsTranslation } from 'src/modules/main/entities/news-translation.entity'

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: false })
  isPublished: boolean

  @Column()
  slug: string

  @Column()
  thumbnailUrl: string

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @OneToMany(() => NewsTranslation, (translation) => translation.news)
  translationList: NewsTranslation[]

  @ManyToOne(() => NewsCategory, (category) => category.news)
  newsCategory: NewsCategory
}
