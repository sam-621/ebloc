import { Column, ManyToOne, OneToMany, Entity as TypeOrmEntity } from 'typeorm';

import { EBlocEntity } from './ebloc-entity';
import { ShipmentEntity } from './shipment.entity';
import { ZoneEntity } from './zone.entity';

@TypeOrmEntity('shipping_method')
export class ShippingMethodEntity extends EBlocEntity {
  @Column('varchar')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { name: 'price_calculator_code' })
  priceCalculatorCode: string;

  @Column('boolean')
  enabled: boolean;

  @OneToMany(() => ShipmentEntity, p => p.method)
  shipments: ShipmentEntity[];

  @ManyToOne(() => ZoneEntity, z => z.shippingMethods)
  zone: ZoneEntity;
}
