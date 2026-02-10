import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter;
  private otps = new Map<string, string>(); // In-memory OTP store; use Redis for prod

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new Error('Email exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email, otp);
    console.log(`OTP for ${email}: ${otp}`);

    /*await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP is ${otp}`,
    }); */

    return { message: 'OTP logged to console' };
  }

  async verify(email: string, otp: string) {
    if (this.otps.get(email) !== otp) throw new Error('Invalid OTP');

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    user.isVerified = true;
    await this.userRepo.save(user);
    this.otps.delete(email);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user && user.isVerified && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}