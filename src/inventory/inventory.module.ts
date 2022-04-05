import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientRepository } from './ingredient.repository';
import { AuthModule } from 'src/auth/auth.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { InvoiceRepository } from './invoce.repository';
import { StockChangeHistoryRepository } from './history-change.repository';


@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository,InvoiceRepository,StockChangeHistoryRepository])
  ,AuthModule,SupplierModule],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}
