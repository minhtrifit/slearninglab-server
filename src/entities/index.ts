import { Account } from 'src/auth/entities/auth.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Attendance } from 'src/classroom/entities/classroom.entity';

const entities = [Account, Classroom, Attendance];

export { Account };
export { Classroom };
export { Attendance };
export default entities;
