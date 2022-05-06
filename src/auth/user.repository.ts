import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserCredentialDto } from "./Dto/create-user.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async createUser(userCredentialDto: UserCredentialDto): Promise<void>{
        const {username,password,firstname,lastname} = userCredentialDto
        const salt = await bcrypt.genSalt()
        const hasedPassword = await bcrypt.hash(password,salt)
        
        const newUser = this.create({username,password:hasedPassword,firstname,lastname})
        try {
            await this.save(newUser)
        } catch (error) {
            if (error.errno === 1062){
                throw new ConflictException("Username already exist")
            }
            else{
                throw new InternalServerErrorException()
            }
        }

    }

    async GetUserById(id:string): Promise<User>{
        return await this.findOne(id)
    }
    
}