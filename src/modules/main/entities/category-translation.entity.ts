import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from './news-category.entity'

@Entity()
export class CategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => NewsCategory, (category) => category.translations)
  category: NewsCategory

  @Column()
  language: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string
}
