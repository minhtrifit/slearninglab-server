import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStartingServer(): string {
    return 'Server run successfully';
  }
}
