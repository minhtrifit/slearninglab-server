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

@Entity()
export class Calender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  publicId: string;

  @Column()
  title: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column()
  username: string;
}
