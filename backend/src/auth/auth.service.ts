import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private resend: Resend;
  private otps = new Map<string, { otp: string; expires: number }>(); // Improved: add expiry

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'FX Trading App <onboarding@resend.dev>',
        to: [email],
        subject: 'Your FX Trading App Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #007bff;">Verify Your Account</h2>
            <p>Hello,</p>
            <p>Use the code below to complete your registration:</p>
            <h1 style="color: #007bff; letter-spacing: 10px; text-align: center; font-size: 32px; margin: 20px 0;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email or contact support.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0;" />
            <p style="font-size: 12px; color: #666;">FX Trading App — Trade currencies securely.</p>
          </div>
        `,
      });

      if (error) {
        console.error('Resend email error:', error);
        throw new Error('Failed to send OTP email');
      }

      console.log(`OTP email sent successfully to ${email} - Message ID: ${data?.id}`);
    } catch (err) {
      console.error('Email sending failed:', err);
      throw new Error('Could not send verification email. Please try again.');
    }
  }

  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new Error('Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.otps.set(email, { otp, expires });

    const skipEmail = process.env.SKIP_EMAIL_SENDING === 'true';
    if (skipEmail) {
      console.log(`[DEMO MODE] Skipping email send. OTP for ${email}: ${otp}`);
      return {
        message: 'User registered! (Demo mode - OTP shown below)',
        otp: otp,
        expiresIn: '10 minutes',
      };
    } else {
      try {
        await this.sendOtpEmail(email, otp);
      } catch (err) {
        console.error('Email failed but registration continued for demo:', err);
      }
    }

    return {
      message: skipEmail
        ? 'User registered! Check server logs for OTP (demo mode)'
        : 'OTP sent to your email',
    };
  }

  async verify(email: string, otp: string) {
    const stored = this.otps.get(email);
    if (!stored) throw new Error('No OTP found for this email');
    if (Date.now() > stored.expires) {
      this.otps.delete(email);
      throw new Error('OTP has expired');
    }
    if (stored.otp !== otp) throw new Error('Invalid OTP');

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