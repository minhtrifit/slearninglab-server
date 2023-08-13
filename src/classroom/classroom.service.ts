import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { Attendance } from './entities/classroom.entity';

import { createClassDto } from './dto/create-classroom.dto';
import { AttendanceType } from 'src/types';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async createClassroom(classroom: createClassDto) {
    const className: string = classroom.className;
    const checkClassroom = await this.classroomRepository.findOneBy({
      className,
    });

    if (!checkClassroom) {
      const rs = await this.classroomRepository.save(classroom);

      const attanceData: AttendanceType = {
        classId: rs.id,
        userJoinedId: rs.teacherUsername,
        dateJoined: rs.dateCreated,
      };

      await this.attendanceRepository.save(attanceData);

      return classroom;
    } else {
      throw new BadRequestException('Classroom name is exist');
    }
  }

  async getAllClasses() {
    const classList = await this.classroomRepository.find();

    if (classList.length !== 0) {
      return classList;
    } else {
      throw new NotFoundException('Class data is empty');
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

  async checkUserAttendance(username: string) {
    const checkUser = await this.attendanceRepository.find({
      where: {
        userJoinedId: username,
      },
    });

    if (checkUser.length === 0) return false;
    else return true;
  }

  async getClassInfoById(id: string, username: string) {
    const checkUserAttendance = await this.checkUserAttendance(username);

    if (checkUserAttendance === true) {
      const targetClass = await this.classroomRepository.find({
        where: {
          id: id,
        },
      });

      if (targetClass.length !== 0) {
        return targetClass[0];
      } else {
        throw new NotFoundException('Not found class by id');
      }
    } else {
      throw new UnauthorizedException('User not joined this class');
    }
  }

  async getClassJoinedByUsername(username: string) {
    const classList = await this.getAllClasses();

    // Get list user joined
    const attendanceList = await this.attendanceRepository.find({
      where: {
        userJoinedId: username,
      },
    });

    if (attendanceList.length !== 0) {
      // const classJoinedList = [];

      // await Promise.all(
      //   joinedList.map(async (item) => {
      //     const check: any = await this.classroomRepository.find({
      //       where: {
      //         id: item.classId,
      //       },
      //     });
      //     classJoinedList.push(check[0]);
      //   }),
      // );

      // return classJoinedList;

      const joinedList = classList.filter((classroom) => {
        return attendanceList.some((attendance) => {
          return attendance.classId === classroom.id;
        });
      });

      return joinedList;
    } else {
      throw new NotFoundException('User not joined any class');
    }
  }

  async acceptJoinClass(acceptJoinClassDto: AttendanceType) {
    const checkExist = await this.attendanceRepository.find({
      where: {
        classId: acceptJoinClassDto.classId,
        userJoinedId: acceptJoinClassDto.userJoinedId,
      },
    });

    if (checkExist.length === 0) {
      await this.attendanceRepository.save(acceptJoinClassDto);
    }

    return acceptJoinClassDto;
  }

  async getClassCanJoinByUsername(username: string) {
    const classList = await this.getAllClasses();

    // Get list user joined
    const joinedList = await this.attendanceRepository.find({
      where: {
        userJoinedId: username,
      },
    });

    const canJoinList = classList.filter((classroom) => {
      return joinedList.every((attendance) => {
        return attendance.classId !== classroom.id;
      });
    });

    return canJoinList;
  }
}
