import { EblocConfig } from './ebloc.config';
import { TestPaymentHandler } from './payments';
import { FlatPriceCalculator } from './shipping';

import { CloudinaryStorageProvider } from '@/lib/storage';

/**
 * This config is only for local development purposes
 */
export const DEFAULT_EBLOC_CONFIG: EblocConfig = {
  app: {
    port: 3000
  },
  auth: {
    jwtExpiresIn: '7d',
    jwtSecret: "randomBytes(32).toString('hex')"
  },
  db: {
    url: 'postgres://postgres:postgres@localhost:5432/ebloc'
    // url: 'postgresql://postgres:C635-525g65d6fEecce*eAc6fBDf5F6G@viaduct.proxy.rlwy.net:16696/railway'
  },
  assets: {
    storageProvider: new CloudinaryStorageProvider({
      cloudName: 'dnvp4s8pe',
      apiKey: '224627828215865',
      apiSecret: 'eos_1HKoJaRp7beDXp7s2Jh_2LM'
    })
  },
  payments: {
    handlers: [new TestPaymentHandler()]
  },
  shipping: {
    priceCalculators: [new FlatPriceCalculator()]
  },
  adminUi: {
    branding: {
      name: 'EBloc',
      description:
        "A functional and scalable minimal e-commerce admin that can be adjusted to any user's requirement."
    },
    serveUrl: '/admin'
  },
  plugins: []
};
