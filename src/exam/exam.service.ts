import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Exam, Question } from './entities/exam.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createExam(createExamDto: CreateExamDto) {
    const examData = createExamDto.exam;
    const questionData = createExamDto.question;

    const rs = await this.examRepository.save(examData);

    if (questionData.length !== 0 && rs.id !== '') {
      questionData.map(async (question) => {
        return await this.questionRepository.save({
          ...question,
          examId: rs.id,
        });
      });
    }

    return createExamDto;
  }

  async getExamByClassId(classId: string) {
    const examList = await this.examRepository.find({
      where: {
        classId: classId,
      },
    });

    return examList;
  }
}
