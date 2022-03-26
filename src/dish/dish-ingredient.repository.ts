import { User } from "src/auth/user.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { EntityRepository, Repository } from "typeorm";
import { DishIngredient } from "./Enitity/dish-ingredient.entity";
import { Dish } from "./Enitity/dish.entity";

@EntityRepository(DishIngredient)
export class DishIngredientRepository extends Repository<DishIngredient>{
    


    // async CraeteDishIngredients(ingredienIds: string[], dishId: string): Promise<string> {
    //     await  ingredienIds.forEach(id => this.insert({ingredient,dish}))
    //     const newIngredient = this.create({stock,user})
    //     await this.save(newIngredient)
    //     return "success"
    // }

    async GetDishIngredients(dishId: string){
        const query = this.createQueryBuilder('dish_ingredient')
        .andWhere('dish_ingredient.dishId = :dishId',{dishId})
        .leftJoinAndSelect("dish_ingredient.ingredient", "ingredient")
        const foundIngredientDish =await query.getMany()


        // const foundIngredientDish =await this.find({
        //     relations: ['dish'],
        //     loadRelationIds: true,
        //     where:{
        //     dish : {id :dishId}}
        // })
        
        return foundIngredientDish;
    }


    async CraeteDishIngredient(ingredient: Ingredient,amount: number, dish: Dish): Promise<string> {
        
        const newDishIngredient = this.create({ingredient,amount,dish})
        await this.save(newDishIngredient)
        return "success"
    }

}