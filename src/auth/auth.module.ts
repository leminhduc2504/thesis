import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports:[
  PassportModule.register({      
    defaultStrategy: 'jwt'}),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: 3600 },
  }),
  TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [JwtStrategy,PassportModule,AuthService]
})
export class AuthModule {}
