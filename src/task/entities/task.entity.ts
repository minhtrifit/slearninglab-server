import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  columnId: string;

  @Column()
  content: string;

  @Column()
  username: string;
}
