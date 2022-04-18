import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DishRepository } from './repository/dish.repository';
import { DishIngredientRepository } from './repository/dish-ingredient.repository';
import { InventoryModule } from 'src/inventory/inventory.module';
import { DishCategoryRepository } from './repository/dish-category-repository';

@Module({
  imports: [TypeOrmModule.forFeature([DishRepository,DishIngredientRepository,DishCategoryRepository]),
  AuthModule,InventoryModule],
  providers: [DishService],
  controllers: [DishController],
  exports:[DishService]
})
export class DishModule {}
