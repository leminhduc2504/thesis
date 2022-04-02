import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialDto } from './Dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async signUp(userCredentialDto: UserCredentialDto): Promise<void>{
        return this.userRepository.createUser(userCredentialDto)
    }

    async signIn(userCredentialDto: UserCredentialDto): Promise<{access_token: string}>{
        const {username,password} = userCredentialDto
        const user = await this.userRepository.findOne({username})

        if( user && (await bcrypt.compare(password, user.password))){
            const payload: JwtPayLoad = {username}
            const access_token : string = this.jwtService.sign(payload)
            return {access_token}
        }
        else{
            throw new UnauthorizedException("Please check your username and password")
        }
    }

    async GetUserById(id:string): Promise<User>{
        return this.userRepository.GetUserById(id)
    }
    
}
