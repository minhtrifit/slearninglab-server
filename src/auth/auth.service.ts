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
import { Account, Attendance, Result, Calender, Task } from '../entities/index';
import {
  registerAccountDto,
  loginAccountDto,
  verifyEmailDto,
} from './dto/create-auth.dto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/models/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Calender)
    private readonly calenderRepository: Repository<Calender>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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

  async getTokens(id: string, username: string, roles: Role[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: id,
          username: username,
          roles: roles,
        },
        {
          secret: process.env.JWT_ACCESS_KEY,
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          id: id,
          username: username,
          roles: roles,
        },
        {
          secret: process.env.JWT_REFRESH_KEY,
          expiresIn: '30s',
        },
      ),
    ]);

    const user = await this.getUserByUsername(username);

    return {
      ...user,
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
            roles: result.roles,
          };

          const checkUser = await this.getUserByUsername(newUser.username);

          if (!checkUser) await this.accountRepository.save(newUser);
          else throw new BadRequestException('Account is already exist');

          return {
            username: result.username,
            name: result.name,
            email: result.email,
            roles: result.roles,
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
      if (checkPassword)
        return await this.getTokens(user?.id, user.username, user.roles);
      else throw new BadRequestException('Username or password incorrect');
    } else {
      throw new NotFoundException('Username not found');
    }
  }

  async refreshToken(username: string) {
    const user = await this.getUserByUsername(username);
    // console.log(user);

    if (!user) throw new ForbiddenException('Access Denied');
    return {
      message: 'Refresh token successfully',
      tokens: await this.getTokens(user?.id, user.username, user.roles),
    };
  }

  async verifyAccessToken(accessToken: string) {
    const data: any = await jwt.verify(
      accessToken,
      this.configService.get('JWT_ACCESS_KEY'),
    );

    return {
      message: 'Access token valid',
      data: await this.getUserByUsername(data?.username),
    };
  }

  async getUserProfile(username: string) {
    const findUser = await this.accountRepository.findOne({
      where: {
        username: username,
      },
    });

    const countAttendance = await this.attendanceRepository.find({
      where: {
        userJoinedId: username,
      },
    });

    const countResult = await this.resultRepository.find({
      where: {
        usernameId: username,
      },
    });

    const countCalender = await this.calenderRepository.find({
      where: {
        username: username,
      },
    });

    const countTask = await this.taskRepository.find({
      where: {
        username: username,
      },
    });

    if (findUser)
      return {
        username: findUser.username,
        name: findUser.name,
        id: findUser.id,
        email: findUser.email,
        roles: findUser.roles,
        countAttendance: countAttendance?.length,
        countResult: countResult?.length,
        countCalender: countCalender?.length,
        countTask: countTask?.length,
      };
    else throw new NotFoundException('User not found');
  }
}
