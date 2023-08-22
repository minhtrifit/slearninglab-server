import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  classId: string;

  @Column()
  fileName: string;

  @Column()
  dateUploaded: Date;
}
