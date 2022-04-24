import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientRepository } from './repository/ingredient.repository';
import { AuthModule } from 'src/auth/auth.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { InvoiceRepository } from './repository/invoice.repository';
import { StockChangeHistoryRepository } from './repository/history-change.repository';
import { IngredientCategory } from './Entity/ingredient-category.entity';
import { IngredientCategoryRepository } from './repository/ingredient-category.repository';


@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository,
    InvoiceRepository,
    StockChangeHistoryRepository,
    IngredientCategoryRepository])
  ,AuthModule,SupplierModule],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}
