import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Calender } from './entities/task.entity';
import { v4 } from 'uuid';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Calender)
    private readonly calenderRepository: Repository<Calender>,
  ) {}

  async getAllTasks() {
    return await this.taskRepository.find();
  }

  async getTaskByUsername(username: string) {
    return await this.taskRepository.find({
      where: {
        username: username,
      },
    });
  }

  async getCalenderByUsername(username: string) {
    return await this.calenderRepository.find({
      where: {
        username: username,
      },
    });
  }

  async updateTaskList(updateTaskListDto: any) {
    const taskList = updateTaskListDto.taskList;
    const username = updateTaskListDto.username;
    const taskListByUsername = await this.getTaskByUsername(username);

    const allTasks = await this.getAllTasks();

    if (taskList.length < taskListByUsername.length) {
      console.log('Delete');
      const newTaskList = [];
      // eslint-disable-next-line no-var
      for (var i = 0; i < taskListByUsername.length; ++i) {
        // eslint-disable-next-line no-var
        for (var j = 0; j < taskList.length; ++j) {
          if (taskList[j].id === taskListByUsername[i].id) {
            newTaskList.push(taskList[j]);
          }
        }
      }

      // Delete old task list by username
      await this.taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where('username = :username', { username: username })
        .execute();

      // Save new task list by username
      this.taskRepository.save(newTaskList);
    } else {
      console.log('Add');

      taskList.map(async (task) => {
        await this.taskRepository.save({ ...task, username: username });
      });
    }

    return updateTaskListDto;
  }

  async updateCalenderList(updateCalenderListDto: any) {
    const calenderList = updateCalenderListDto.calenderList;
    const username = updateCalenderListDto.username;
    const calenderListByUsername = await this.getCalenderByUsername(username);

    // Delete old calender
    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .from(Calender)
      .where('username = :username', { username: username })
      .execute();

    // Save new calender
    calenderList.map(async (cal) => {
      await this.calenderRepository.save({ ...cal, username: username });
    });

    return updateCalenderListDto;
  }
}
