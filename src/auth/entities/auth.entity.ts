import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/models/role.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column('text', { array: true })
  roles: Role[];
}
