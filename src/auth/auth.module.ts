import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/index';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/strategies/refreshToken.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
