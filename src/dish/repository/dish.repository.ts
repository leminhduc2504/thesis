import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { DishCategory } from "../Enitity/dish-category.entity";
import { Dish } from "../Enitity/dish.entity";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish>{
    

    async getDishs(categoryName: string , user: User): Promise<Dish[]>{

        const query = this.createQueryBuilder('dish')
        query.where({user})
        .leftJoinAndSelect("dish.dishIngredients","dishIngredients")
        .leftJoinAndSelect("dishIngredients.ingredient", "ingredient")
        .leftJoinAndSelect("dish.dishCategory","dishCategory")

        if(categoryName){
            query.andWhere(
                'dishCategory.name = :categoryName', {categoryName}
            )
        }
        const dishs =await query.getMany()
        return dishs;
    }

    async GetDishById(id: string): Promise<Dish>{
        // const query = this.createQueryBuilder('dish')
        // query.where({user,id})
        // .leftJoinAndSelect("dish.dishIngredients","dishIngredients")
        // .leftJoinAndSelect("dishIngredients.ingredient", "ingredient")
        // const foundDish =await query.getMany()

        const foundDish =await this.findOne(id)
        if(!foundDish){
            throw new NotFoundException(`Task with id '${id}' not found`)
        }
        return foundDish
    }

    async CreateDish(name: string,retailPrice: number, ingredientPrice: number, user: User): Promise<Dish>{
        // const {name,ingredient_ids} = createDishDto
        
        const newDish = this.create({name,retailPrice,ingredientPrice,user})
        await this.save(newDish)
        return newDish
    }

    async DeleteDish(id: string,user:User){
        const deletedDish = await this.delete({id,user})
    }

    async AssignCategory(dishId:string, category: DishCategory ){
        const dish = await this.GetDishById(dishId)
        dish.dishCategory =category
        await this.save(dish)
    }
}
