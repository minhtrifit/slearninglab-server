import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam, Question, Result } from '../entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question, Result])],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
