import {
  Controller,
  Get,
  Post,
  Body,
  RawBodyRequest,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';

import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/models/role.enum';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('createExam')
  createExam(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const CreateExamDto: CreateExamDto = data.body;
    return this.examService.createExam(CreateExamDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Get('getExamByClassId')
  getExamByClassId(@Req() req: any) {
    const classId: string = req.query.classId;
    return this.examService.getExamByClassId(classId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Get('getDetailExamById')
  getDetailExamById(@Req() req: any) {
    const id: string = req.query.id;
    return this.examService.getDetailExamById(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Student)
  @Get('getDetailExamNonAnsById')
  getDetailExamNonAnsById(@Req() req: any) {
    const id: string = req.query.id;
    return this.examService.getDetailExamNonAnsById(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Student)
  @Post('submitExam')
  submitExam(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const submitExamDto: any = data.body;
    return this.examService.submitExam(submitExamDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('deleteExam')
  deleteExam(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const examId: string = data.body?.examId;
    return this.examService.deleteExam(examId);
  }
}
