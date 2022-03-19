// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { InventoryService } from "src/inventory/inventory.service";
// import { DishIngredientRepository } from "./dish-ingredient.repository";
// import { DishService } from "./dish.service";

// @Injectable()
// export class DishIngredientService {
//     constructor(
//         @InjectRepository(DishIngredientRepository)
//         private dishIngredientRepository: DishIngredientRepository,
//         private inventoryService: InventoryService,
//         private dishService: DishService,
        
//     ){}

//     async CreateListDishIngredient(ingredientIds: string[], dishId: string){
//         ingredientIds.forEach(async ingredientId => this.dishIngredientRepository.CraeteDishIngredient(
//             await this.inventoryService.GetIngredientsById(ingredientId),
//             await this.dishService.GetDishById(dishId)
//         ))

//     }
// }