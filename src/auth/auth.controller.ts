import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  registerAccountDto,
  loginAccountDto,
  verifyEmailDto,
} from './dto/create-auth.dto';
import { AccessTokenGuard } from './guard/accessToken.guard';
import { RefreshTokenGuard } from './guard/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  createNewAccount(@Body() registerAccountDto: registerAccountDto) {
    return this.authService.createNewAccount(registerAccountDto);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  verifyEmailRegister(@Body() verifyEmailDto: verifyEmailDto) {
    return this.authService.verifyEmailRegister(verifyEmailDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginAccount(@Body() loginAccountDto: loginAccountDto) {
    return this.authService.loginAccount(loginAccountDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshToken(@Req() req: any) {
    console.log('Check from auth.controller(refreshToken):', req?.user);
    return this.authService.refreshToken(req?.user?.username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/view/users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
