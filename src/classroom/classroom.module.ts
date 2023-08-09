import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom } from '../entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom])],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
