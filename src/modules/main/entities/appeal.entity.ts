import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Appeal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  finishedAt: Date

  @Column({ type: 'enum', enum: ['join', 'revalidation'] })
  type: 'join' | 'revalidation'

  @Column({ type: 'bigint' })
  ipn: bigint

  @Column()
  age: number
}
