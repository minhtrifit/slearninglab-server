import { Account } from 'src/auth/entities/auth.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Attendance } from 'src/classroom/entities/classroom.entity';
import { Exam, Question, Result } from 'src/exam/entities/exam.entity';
import { Task, Calender } from 'src/task/entities/task.entity';

const entities = [
  Account,
  Classroom,
  Attendance,
  Exam,
  Question,
  Result,
  Task,
  Calender,
];

export { Account };
export { Classroom };
export { Attendance };
export { Exam };
export { Question };
export { Result };
export { Task };
export { Calender };
export default entities;
