import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { EntityRepository, Repository } from "typeorm";
import { DishIngredient } from "./Enitity/dish-ingredient.entity";
import { Dish } from "./Enitity/dish.entity";

@EntityRepository(DishIngredient)
export class DishIngredientRepository extends Repository<DishIngredient>{
    constructor(

    ){
        super();
    }


    // async CraeteDishIngredients(ingredienIds: string[], dishId: string): Promise<string> {
    //     await  ingredienIds.forEach(id => this.insert({ingredient,dish}))
    //     const newIngredient = this.create({stock,user})
    //     await this.save(newIngredient)
    //     return "success"
    // }

    async CraeteDishIngredient(ingredient: Ingredient,amount: number, dish: Dish): Promise<string> {
        
        const newDishIngredient = this.create({ingredient,amount,dish})
        await this.save(newDishIngredient)
        return "success"
    }

}