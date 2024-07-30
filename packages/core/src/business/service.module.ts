import { Module } from '@nestjs/common';

import { AdminService } from './admin';
import { ProductService } from './product';
import {
  AssetService,
  CollectionService,
  CountryService,
  CustomerService,
  OptionService,
  OptionValueService,
  OrderService,
  PaymentMethodService,
  PaymentService,
  ShipmentService,
  ShippingMethodService,
  VariantService,
  ZoneService
} from './services';
import { SecurityModule } from '../security';

const SERVICES = [
  AdminService,
  ProductService,
  VariantService,
  OptionService,
  OptionValueService,
  AssetService,
  OrderService,
  PaymentMethodService,
  PaymentService,
  ShippingMethodService,
  ShipmentService,
  CustomerService,
  CollectionService,
  CountryService,
  ZoneService
];

@Module({
  imports: [SecurityModule],
  providers: [...SERVICES],
  exports: [...SERVICES]
})
export class ServiceModule {}