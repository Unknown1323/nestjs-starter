import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { NewsCategory } from 'src/modules/main/entities/news-category.entity'

@Entity()
export class NewsCategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => NewsCategory, (category) => category.translationList, { nullable: true })
  category: NewsCategory

  @Column()
  lang: string

  @Column({ nullable: true })
  title: string
}
