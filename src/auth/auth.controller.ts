import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  registerAccountDto,
  loginAccountDto,
  verifyEmailDto,
} from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  createNewAccount(@Body() registerAccountDto: registerAccountDto) {
    return this.authService.createNewAccount(registerAccountDto);
  }

  @Post('/verifyEmail')
  @UsePipes(ValidationPipe)
  verifyEmailRegister(@Body() verifyEmailDto: verifyEmailDto) {
    return this.authService.verifyEmailRegister(verifyEmailDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  loginAccount(@Body() loginAccountDto: loginAccountDto) {
    return this.authService.loginAccount(loginAccountDto);
  }
}
