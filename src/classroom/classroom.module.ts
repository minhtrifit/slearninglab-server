import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom, Attendance } from '../entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, Attendance])],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
