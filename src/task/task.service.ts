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

  async getAllCalenders() {
    return await this.calenderRepository.find();
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

  async checkExistCalender(cal: any, username: string) {
    const allCalenders = await this.getAllCalenders();
    // eslint-disable-next-line no-var
    for (var i = 0; i < allCalenders.length; ++i) {
      if (
        allCalenders[i].username === username &&
        allCalenders[i].publicId === cal.publicId
      ) {
        return true;
      }
    }

    return false;
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

    const allCalenders = await this.getAllCalenders();

    if (calenderList.length < calenderListByUsername.length) {
      console.log('Delete');
      const newCalenderList = [];
      // eslint-disable-next-line no-var
      for (var i = 0; i < calenderListByUsername.length; ++i) {
        // eslint-disable-next-line no-var
        for (var j = 0; j < calenderList.length; ++j) {
          if (calenderList[j].publicId === calenderListByUsername[i].publicId) {
            newCalenderList.push({ ...calenderList[j], username: username });
          }
        }
      }

      // Delete old task list by username
      await this.calenderRepository
        .createQueryBuilder()
        .delete()
        .from(Calender)
        .where('username = :username', { username: username })
        .execute();

      // Save new task list by username
      this.calenderRepository.save(newCalenderList);
    } else {
      console.log('Add');

      calenderList.map(async (cal) => {
        if ((await this.checkExistCalender(cal, username)) === false) {
          console.log('Save');
          await this.calenderRepository.save({
            ...cal,
            username: username,
          });
        } else {
          await this.calenderRepository
            .createQueryBuilder()
            .update(Calender)
            .set({ start: cal.start, end: cal.end })
            .where('publicId = :publicId', { publicId: cal.publicId })
            .where('username = :username', { username: username })
            .execute();
        }
      });
    }

    return updateCalenderListDto;
  }
}
