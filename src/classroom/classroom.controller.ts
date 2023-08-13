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
import { Request } from 'express';
import { ClassroomService } from './classroom.service';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/models/role.enum';
import { createClassDto, acceptJoinClassDto } from './dto/create-classroom.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('create')
  createNewClass(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const createClassDto: createClassDto = data.body;
    return this.classroomService.createClassroom(createClassDto);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Get('getClassByUsername')
  getClassByUsername(@Req() req: Request) {
    const username: any = req.query.username;
    return this.classroomService.getClassByUsername(username);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Student)
  @Get('getAllClasses')
  getAllClasses() {
    return this.classroomService.getAllClasses();
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('getClassInfoById')
  getClassInfoById(@Req() req: Request) {
    const id: any = req.query.id;
    const username: any = req.query.username;
    return this.classroomService.getClassInfoById(id, username);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('getClassJoinedByUsername')
  getClassJoinedByUsername(@Req() req: Request) {
    const username: any = req.query.username;
    return this.classroomService.getClassJoinedByUsername(username);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @HasRoles(Role.Teacher)
  @Post('acceptJoinClass')
  acceptJoinClass(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const acceptJoinClassDto: acceptJoinClassDto = data.body;
    return this.classroomService.acceptJoinClass(acceptJoinClassDto);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('getClassCanJoinByUsername')
  getClassCanJoinByUsername(@Req() req: Request) {
    const username: any = req.query.username;
    return this.classroomService.getClassCanJoinByUsername(username);
  }
}
