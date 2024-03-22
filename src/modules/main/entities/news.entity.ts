import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'
import { Translation } from 'src/modules/main/entities/translation.entity'

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: false })
  publishedAt: boolean

  @Column()
  slug: string

  @Column({ nullable: true })
  newsCategoryId: string | null

  @Column()
  thumbnailUrl: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date

  @OneToMany(() => Translation, (translation) => translation.news)
  translationList: Translation[]

  @ManyToOne(() => NewsCategory, (category) => category.news)
  newsCategory: NewsCategory
}
