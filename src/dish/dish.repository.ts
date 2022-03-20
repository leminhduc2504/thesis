import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateDishDto } from "./Dto/create_dish.dto";
import { Dish } from "./Enitity/dish.entity";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish>{
    

    async getDishs(user: User): Promise<Dish[]>{

        const query = this.createQueryBuilder('ingredient')
        query.where({user})
        // if(search){
        //     query.andWhere(
        //         'ingredient.name LIKE :search', {search: `%${search}%`}
        //     )
        // }
        const dishs =await query.getMany()
        return dishs;
    }

    async GetDishById(id: string): Promise<Dish>{
        const foundDish =await this.findOne(id)
        if(!foundDish){
            throw new NotFoundException(`Task with id '${id}' not found`)
        }
        return foundDish
    }

    async CreateDish(name: string,retail_price: number, ingredient_price: number, user: User): Promise<Dish>{
        // const {name,ingredient_ids} = createDishDto
        
        const newDish = this.create({name,retail_price,ingredient_price,user})
        await this.save(newDish)
        return newDish
    }
}
