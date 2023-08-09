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
import { ClassroomService } from './classroom.service';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/models/role.enum';
import { createClassDto } from './dto/create-classroom.dto';

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
    return createClassDto;
  }
}