import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Account } from '../entities/index';
import {
  registerAccountDto,
  loginAccountDto,
  verifyEmailDto,
} from './dto/create-auth.dto';
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
    const email: string = registerAccountDto.email;

    // Check user from database
    const userUsername = await this.accountRepository.findOneBy({ username });
    const userEmail = await this.accountRepository.findOneBy({ email });

    // Create new user to database
    if (!userUsername && !userEmail) {
      const code = Math.floor(10000 + Math.random() * 9000).toString();

      // Hash password
      registerAccountDto.password = await bcrypt.hash(
        registerAccountDto.password,
        10,
      );

      // Email code generate
      const checkCode = jwt.sign(
        { ...registerAccountDto, code: code },
        'jwt_secret_key',
        {
          expiresIn: '60s',
        },
      );

      // Send email method
      await this.mailService.sendUserConfirmation(registerAccountDto, code);

      // return await this.accountRepository.save(registerAccountDto);
      return { code: code, checkCode: checkCode };
    } else {
      // Return error if user exist
      throw new BadRequestException('Account is already exist');
    }
  }

  async verifyEmailRegister(verifyEmailDto: verifyEmailDto) {
    try {
      const checkCode: string = verifyEmailDto.checkCode;
      if (checkCode) {
        const result = await jwt.verify(checkCode, 'jwt_secret_key');
        if (result.code === verifyEmailDto.code) {
          const newUser = {
            username: result.username,
            password: result.password,
            name: result.name,
            email: result.email,
            role: result.role,
          };

          await this.accountRepository.save(newUser);

          return {
            username: result.username,
            name: result.name,
            email: result.email,
            role: result.role,
          };
        }
      } else {
        throw new BadRequestException('Code is missing');
      }
    } catch (error) {
      throw new BadRequestException('Incorrect verify code or outdate');
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
