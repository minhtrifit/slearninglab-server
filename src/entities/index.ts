import { Account } from 'src/auth/entities/auth.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Attendance } from 'src/classroom/entities/classroom.entity';
import { Exam, Question, Result } from 'src/exam/entities/exam.entity';

const entities = [Account, Classroom, Attendance, Exam, Question, Result];

export { Account };
export { Classroom };
export { Attendance };
export { Exam };
export { Question };
export { Result };
export default entities;
