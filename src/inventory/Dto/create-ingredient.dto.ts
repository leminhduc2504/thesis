import { isEmpty } from "class-validator";
import { IngredientUnit } from "../Entity/ingredient.entity";

export class CreateIngredientDto {
    name: string

    stock: number

    priceEach: number

    unit: IngredientUnit

}