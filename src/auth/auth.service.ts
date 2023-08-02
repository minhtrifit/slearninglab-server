import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
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
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getUserByUsername(username: string) {
    return await this.accountRepository.findOneBy({ username });
  }

  async getUserByEmail(email: string) {
    return await this.accountRepository.findOneBy({ email });
  }

  async getTokens(id: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: id,
          username: username,
        },
        {
          secret: process.env.JWT_ACCESS_KEY,
          expiresIn: '20s',
        },
      ),
      this.jwtService.signAsync(
        {
          id: id,
          username: username,
        },
        {
          secret: process.env.JWT_REFRESH_KEY,
          expiresIn: '60s',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getAllUsers() {
    return await this.accountRepository.find();
  }

  async createNewAccount(registerAccountDto: registerAccountDto) {
    const username: string = registerAccountDto.username;
    const email: string = registerAccountDto.email;

    // Check user from database
    const userUsername = await this.getUserByUsername(username);
    const userEmail = await this.getUserByEmail(email);

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
        this.configService.get('JWT_KEY_SECRET'),
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
    const code: string = verifyEmailDto.code;
    const checkCode: string = verifyEmailDto.checkCode;
    if (checkCode) {
      try {
        const result: any = await jwt.verify(
          checkCode,
          this.configService.get('JWT_KEY_SECRET'),
        );

        if (code === result.code) {
          const newUser = {
            username: result.username,
            password: result.password,
            name: result.name,
            email: result.email,
            role: result.role,
          };

          const checkUser = await this.getUserByUsername(newUser.username);

          if (!checkUser) await this.accountRepository.save(newUser);
          else throw new BadRequestException('Account is already exist');

          return {
            username: result.username,
            name: result.name,
            email: result.email,
            role: result.role,
          };
        } else {
          throw new BadRequestException('Verify code incorrect or outdate');
        }
      } catch (error) {
        throw new BadRequestException('Verify code incorrect or outdate');
      }
    } else throw new NotFoundException('Verify code not found');
  }

  async loginAccount(loginAccountDto: loginAccountDto) {
    const username: string = loginAccountDto.username;
    const password: string = loginAccountDto.password;

    // Check user from db
    const user = await this.accountRepository.findOneBy({ username });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) return await this.getTokens(user?.id, user.username);
      else throw new BadRequestException('Username or password incorrect');
    } else {
      throw new NotFoundException('Username not found');
    }
  }

  async refreshToken(username: string) {
    const user = await this.getUserByUsername(username);

    if (!user) throw new ForbiddenException('Access Denied');
    return {
      message: 'Refresh token successfully',
      tokens: await this.getTokens(user?.id, user.username),
    };
  }
}
