import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientRepository } from './ingredient.repository';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository]),AuthModule],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}
