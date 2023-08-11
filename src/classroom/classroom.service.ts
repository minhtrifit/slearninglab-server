import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

import { createClassDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async createClassroom(classroom: createClassDto) {
    const className: string = classroom.className;
    const checkClassroom = await this.classroomRepository.findOneBy({
      className,
    });

    if (!checkClassroom) {
      await this.classroomRepository.save(classroom);
      return classroom;
    } else {
      throw new BadRequestException('Classroom name is exist');
    }
  }

  async getClassByUsername(username: string) {
    const classList = await this.classroomRepository.find({
      where: {
        teacherUsername: username,
      },
    });

    if (classList.length !== 0) {
      return classList;
    } else {
      throw new NotFoundException('Not found class by username');
    }
  }
}
