import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Exam, Question, Result } from './entities/exam.entity';
import { Classroom } from '../classroom/entities/classroom.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async getAllQuestion() {
    return await this.questionRepository.find();
  }

  async getAllExam() {
    return await this.examRepository.find();
  }

  async getAllClass() {
    return await this.classroomRepository.find();
  }

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

  async getDetailExamById(id: string) {
    const detailExam = await this.examRepository.find({
      where: {
        id: id,
      },
    });

    const questionListByExamId = await this.questionRepository.find({
      where: {
        examId: id,
      },
    });

    if (detailExam.length !== 0 && questionListByExamId.length !== 0)
      return { exam: detailExam[0], question: questionListByExamId };
    else {
      throw new NotFoundException('Not found detail exam');
    }
  }

  async getDetailExamNonAnsById(id: string) {
    const questionListNonAnsByExamId = [];

    const detailExam = await this.examRepository.find({
      where: {
        id: id,
      },
    });

    const questionListByExamId = await this.questionRepository.find({
      where: {
        examId: id,
      },
    });

    questionListByExamId.map((question) => {
      const questionData = { ...question };
      delete questionData['correct'];
      return questionListNonAnsByExamId.push(questionData);
    });

    if (detailExam.length !== 0 && questionListNonAnsByExamId.length !== 0)
      return { exam: detailExam[0], question: questionListNonAnsByExamId };
    else {
      throw new NotFoundException('Not found detail exam');
    }
  }

  async submitExam(submitExamDto: any) {
    // console.log('Check:', submitExamDto);
    let countCorrect = 0;
    let countExamQuestion = 0;
    const questionList = await this.getAllQuestion();

    questionList.map((question) => {
      if (question.examId === submitExamDto.examId) {
        ++countExamQuestion;
      }
    });

    submitExamDto.question.map((q) => {
      return questionList.map((question) => {
        if (q.questionid === question.id && question.correct === q.ans) {
          ++countCorrect;
        }
      });
    });

    const findExam = await this.examRepository.find({
      where: {
        id: submitExamDto.examId,
      },
    });

    const rs = await this.resultRepository.save({
      usernameId: submitExamDto.usernameId,
      classId: submitExamDto.classId,
      examId: submitExamDto.examId,
      amount: countExamQuestion,
      result: countCorrect,
      date: new Date(new Date().getTime()),
    });

    if (rs && findExam?.length !== 0)
      return { ...rs, examName: findExam[0]?.examName };
    else throw new BadRequestException('Save exam result failed');
  }

  async deleteExam(examId: string) {
    try {
      await this.examRepository
        .createQueryBuilder('exam')
        .delete()
        .from(Exam)
        .where('id = :id', { id: examId })
        .execute();

      await this.questionRepository
        .createQueryBuilder('question')
        .delete()
        .from(Question)
        .where('examId = :examId', { examId: examId })
        .execute();

      return examId;
    } catch (error) {
      throw new BadRequestException('Delete exam failed');
    }
  }

  async getExamResultByUsername(username: string) {
    const data = [];

    const userResult = await this.resultRepository.find({
      where: {
        usernameId: username,
      },
    });

    const examData = await this.getAllExam();
    const classData = await this.getAllClass();

    // eslint-disable-next-line no-var
    for (var i = 0; i < userResult.length; ++i) {
      // eslint-disable-next-line no-var
      for (var j = 0; j < examData.length; ++j) {
        // eslint-disable-next-line no-var
        for (var k = 0; k < classData.length; ++k) {
          if (
            userResult[i].examId === examData[j].id &&
            userResult[i].classId === classData[k].id
          ) {
            data.push({
              ...userResult[i],
              examInfo: examData[j],
              classInfo: classData[k],
            });
          }
        }
      }
    }

    return data;
  }
}
