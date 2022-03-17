import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SupplierRepository } from './supplier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierRepository]),AuthModule],
  providers: [SupplierService],
  controllers: [SupplierController]
})
export class SupplierModule {}
