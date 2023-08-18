export interface jwtResultEmailRegister {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  code: string;
}

export interface AttendanceType {
  id?: string;
  classId: string;
  userJoinedId: string;
  dateJoined: Date;
}

export class ChatType {
  name: string;
  text: string;
  room: string;
}
