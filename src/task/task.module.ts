import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, Calender } from '../entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Calender])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
