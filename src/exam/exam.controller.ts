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
import { HasRoles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/models/role.enum';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('createExam')
  createExam(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const CreateExamDto: CreateExamDto = data.body;
    return this.examService.createExam(CreateExamDto);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('getExamByClassId')
  getExamByClassId(@Req() req: any) {
    const classId: string = req.query.classId;
    return this.examService.getExamByClassId(classId);
  }
}
