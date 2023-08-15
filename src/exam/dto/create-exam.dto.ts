import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsArray,
} from 'class-validator';

class Exam {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsNotEmpty()
  @IsString()
  classId: string;
}

class Question {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsArray()
  ans: string[];

  @IsNotEmpty()
  @IsString()
  correct: string;

  @IsArray()
  img: string[];
}

export class CreateExamDto {
  exam: Exam;
  question: Question[];
}
