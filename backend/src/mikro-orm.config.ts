import dotenv from 'dotenv';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: process.env.DB_NAME || 'product_management_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  debug: process.env.NODE_ENV !== 'production',
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    emit: 'ts',
  },
  // Discovery
  discovery: {
    warnWhenNoEntities: true,
  },

  allowGlobalContext: true
};

export default config;