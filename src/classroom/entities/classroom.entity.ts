import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacherUsername: string;

  @Column()
  className: string;

  @Column()
  amount: number;

  @Column()
  subject: string;

  @Column()
  introduction: string;

  @Column()
  img: string;

  @Column()
  dateCreated: Date;
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  classId: string;

  @Column()
  userJoinedId: string;

  @Column()
  dateJoined: Date;
}
