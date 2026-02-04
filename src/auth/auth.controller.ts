import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.register(body.email, body.password);
  }

  @Post('verify')
  async verify(@Body() body: { email: string; otp: string }) {
    return this.authService.verify(body.email, body.otp);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    return this.authService.login(req.user);  // Or directly sign JWT here
  }

}