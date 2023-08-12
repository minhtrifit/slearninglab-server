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
