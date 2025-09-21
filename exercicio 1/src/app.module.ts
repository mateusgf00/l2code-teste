import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PackagingModule } from './packaging/packaging.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'l2code-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    PackagingModule,
  ],
})
export class AppModule {}
