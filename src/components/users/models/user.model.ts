import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Client, RefreshToken } from '../../authentication'

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null

  @OneToMany(() => Client, client => client.user)
  clients: Client[]

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @OneToMany(() => RefreshToken, token => token.user)
  tokens: RefreshToken[]
}
