import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { SupplierModule } from './supplier/supplier.module';
import { DishModule } from './dish/dish.module';
import { PerformanceModule } from './performance/performance.module';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.116.105.48',
      port: 3306,
      username: 'cud',
      password: 'Cud2504@',
      database: 'thesis',
      autoLoadEntities: true,
      synchronize: true,
      timezone: "-7"
    }),
    AuthModule,
    InventoryModule,
    OrderModule,
    SupplierModule,
    DishModule,
    PerformanceModule,
    TwilioModule.forRoot({
      accountSid: "AC0ca77f5b17307abc9728adc732800b5d",
      authToken: "4b5d9efe083545f525e86b64bddee996",
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
