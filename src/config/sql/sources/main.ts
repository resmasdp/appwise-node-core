import { DataSource } from 'typeorm'
import { mainMigrations } from '../migrations'
import { mainModels } from '../models/models'
import { sslHelper } from '../util/migrate'

export const mainDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.TYPEORM_URI,
  ssl: sslHelper(process.env.TYPEORM_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: mainModels,
  migrations: mainMigrations
})
