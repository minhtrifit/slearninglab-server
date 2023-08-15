import { Account } from 'src/auth/entities/auth.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Attendance } from 'src/classroom/entities/classroom.entity';
import { Exam, Question } from 'src/exam/entities/exam.entity';

const entities = [Account, Classroom, Attendance, Exam, Question];

export { Account };
export { Classroom };
export { Attendance };
export { Exam };
export { Question };
export default entities;
