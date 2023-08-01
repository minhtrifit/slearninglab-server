import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../entities/index';
import { registerAccountDto, loginAccountDto } from './dto/create-auth.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly mailService: MailService,
  ) {}

  async createNewAccount(registerAccountDto: registerAccountDto) {
    const username: string = registerAccountDto.username;

    // Check user from database
    const user = await this.accountRepository.findOneBy({ username });

    // Create new user to database
    if (!user) {
      const token = Math.floor(1000 + Math.random() * 9000).toString();

      await this.mailService.sendUserConfirmation(registerAccountDto, token);

      registerAccountDto.password = await bcrypt.hash(
        registerAccountDto.password,
        10,
      );
      return await this.accountRepository.save(registerAccountDto);
    } else {
      // Return error if user exist
      throw new BadRequestException('Account username is already exist');
    }
  }

  async loginAccount(loginAccountDto: loginAccountDto) {
    const username: string = loginAccountDto.username;
    const password: string = loginAccountDto.password;

    // Check user from db
    const user = await this.accountRepository.findOneBy({ username });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) return user;
      else throw new BadRequestException('Username or password incorrect');
    } else {
      throw new NotFoundException('Username not found');
    }
  }
}
