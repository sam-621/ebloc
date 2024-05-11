import {
  OrderCommonResolver,
  OrderLineCommonResolver,
  PaymentCommonResolver,
  ProductCommonResolver,
  ShipmentCommonResolver,
  VariantCommonResolver,
} from './resolvers';

export const COMMON_RESOLVERS = [
  OrderLineCommonResolver,
  OrderCommonResolver,
  ProductCommonResolver,
  VariantCommonResolver,
  PaymentCommonResolver,
  ShipmentCommonResolver,
];
