import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserCredentialDto } from './Dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post("/signup")
    async signUp(@Body() userCredentialDto: UserCredentialDto): Promise<void>{
        return this.authService.signUp(userCredentialDto)
    }

    @Post("/signin")
    async signIp(@Body() userCredentialDto: UserCredentialDto): Promise<{access_token:string}>{
        return this.authService.signIn(userCredentialDto)
    }

    
    @Get('/test')
    @UseGuards(AuthGuard())
    test(){
        console.log("req")
    }
}
