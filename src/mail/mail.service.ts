import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { registerAccountDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: registerAccountDto, code: string) {
    // nest-cli.json
    // "assets": [
    //   {
    //     "include": "mail/template/**/*",
    //     "outDir": "dist/src"
    //   }
    // ],

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Slearninglab! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.name,
        code: code,
      },
    });
  }
}
