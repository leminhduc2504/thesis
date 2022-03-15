import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const {username} = payload
    const user =await this.userRepository.findOne({username})
    console.log(user)
    if(!user){
      throw new UnauthorizedException
    }
    else{
      return user
    }
    
    
    // console.log("test")
    // return { username: payload.username };
  }
}