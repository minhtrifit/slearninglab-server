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
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Post('updateTaskList')
  updateTaskList(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const updateTaskListDto: any = data.body;
    return this.taskService.updateTaskList(updateTaskListDto);
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(ValidationPipe)
  @Get('getTaskByUsername')
  getTaskByUsername(@Req() req: Request) {
    const username: any = req.query.username;
    return this.taskService.getTaskByUsername(username);
  }
}
