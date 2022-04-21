import {BadRequestException, ConsoleLogger, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { DishCategory } from "../Enitity/dish-category.entity";


@EntityRepository(DishCategory)
export class DishCategoryRepository extends Repository<DishCategory>{

    async CreateDishCategory(name: string,user: User){
        const dup =await this.count({user,name})
        if(dup>0){
            throw new BadRequestException('Duplicate category name')
        }
        const newDishCategory = this.create({name,user})
        await this.save(newDishCategory)
        return "success"
    }

    async GetAllCategory(user:User){
        const query = this.createQueryBuilder('dishCategory')
        query.where({user})
        .leftJoinAndSelect("dishCategory.dishs", "dish")
        const categories = query.getMany()
        
        return categories
    }

    async GetCategoryById(id: string): Promise<DishCategory>{
        const foundCategory =await this.findOne(id)
        if(!foundCategory){
            throw new NotFoundException(`Category with id '${id}' not found`)
        }
        return foundCategory
    }

    
}