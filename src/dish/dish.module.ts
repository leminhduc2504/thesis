import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DishRepository } from './dish.repository';
import { DishIngredientRepository } from './dish-ingredient.repository';
import { InventoryModule } from 'src/inventory/inventory.module';
import { InventoryService } from 'src/inventory/inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([DishRepository,DishIngredientRepository]),AuthModule,InventoryModule],
  providers: [DishService],
  controllers: [DishController],
  exports:[DishService]
})
export class DishModule {}
