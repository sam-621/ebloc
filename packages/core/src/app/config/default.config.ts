import { randomBytes } from 'crypto';

import { VendyxConfig } from './vendyx.config';

import { CloudinaryStorageProvider } from '@/lib/storage';

/**
 * This config is only for local development purposes
 */
export const DEFAULT_VENDYX_CONFIG: VendyxConfig = {
  app: {
    port: 3000,
  },
  auth: {
    jwtExpiresIn: '7d',
    jwtSecret: randomBytes(32).toString('hex'),
  },
  db: {
    // url: 'postgres://postgres:postgres@localhost:5432/vendyx',
    url: 'postgresql://postgres:C635-525g65d6fEecce*eAc6fBDf5F6G@viaduct.proxy.rlwy.net:16696/railway',
  },
  assets: {
    storageProvider: new CloudinaryStorageProvider({
      cloudName: 'dnvp4s8pe',
      apiKey: '224627828215865',
      apiSecret: 'eos_1HKoJaRp7beDXp7s2Jh_2LM',
    }),
  },
};