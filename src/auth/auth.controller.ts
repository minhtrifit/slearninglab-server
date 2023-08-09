import {
  Controller,
  Get,
  Post,
  Body,
  RawBodyRequest,
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
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from './decorator/role.decorator';
import { Role } from 'src/models/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  createNewAccount(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const registerAccountDto: registerAccountDto = data.body;
    return this.authService.createNewAccount(registerAccountDto);
  }

  @Post('verifyEmail')
  @UsePipes(ValidationPipe)
  verifyEmailRegister(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const verifyEmailDto: verifyEmailDto = data.body;
    return this.authService.verifyEmailRegister(verifyEmailDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginAccount(@Req() req: RawBodyRequest<Request>) {
    const data: any = req.body;
    const loginAccountDto: loginAccountDto = data.body;
    return this.authService.loginAccount(loginAccountDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('verify')
  verifyAccessToken(@Req() req: any) {
    const headerAuth = req?.headers?.authorization?.split(' ')[1];
    // console.log(headerAuth);
    return this.authService.verifyAccessToken(headerAuth);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshToken(@Req() req: any) {
    console.log('Check from auth.controller(refreshToken):', req?.user);
    return this.authService.refreshToken(req?.user?.username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('view/users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @HasRoles(Role.Teacher)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('roles/teacher')
  checkRoles() {
    return 'Check teacher role ok';
  }
}
