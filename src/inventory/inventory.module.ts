import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './ingredientUnit.entity';
import { IngredientRepository } from './ingredient.repository';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository,Unit]),AuthModule],
  providers: [InventoryService],
  controllers: [InventoryController]
})
export class InventoryModule {}
