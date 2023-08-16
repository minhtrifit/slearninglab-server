import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllQuestion() {
    return await this.questionRepository.find();
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

    return {
      examId: submitExamDto.examId,
      examQuestionAmount: countExamQuestion,
      correctAns: countCorrect,
    };
  }
}
