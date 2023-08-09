import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}
}
