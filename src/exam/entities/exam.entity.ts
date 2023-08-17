import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examName: string;

  @Column()
  time: number;

  @Column()
  classId: string;
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examId: string;

  @Column()
  title: string;

  @Column()
  amount: number;

  @Column('text', { array: true })
  ans: string[];

  @Column()
  correct: string;

  @Column('text', { array: true })
  img: string[];
}

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usernameId: string;

  @Column()
  classId: string;

  @Column()
  examId: string;

  @Column()
  @Column()
  amount: number;

  @Column()
  result: number;

  @Column()
  date: Date;
}
