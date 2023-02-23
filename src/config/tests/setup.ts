import expect from 'expect'
import { migrate } from '../sql/util/migrate'
import { mainDataSource } from '../sql'
import { uuid } from './utils/expectUuid'
import { ISO8601 } from './utils/expectISO8601'
import { isEnumValue } from './utils/expectEnum'

export interface SeederOptions {
  save?: boolean
}

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') throw new Error('NODE_ENV must be set to test')

  await mainDataSource.initialize()

  await migrate(mainDataSource)

  const qr = mainDataSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()

  Object.defineProperty(mainDataSource.manager, 'queryRunner', {
    configurable: true,
    value: qr
  })

  expect.extend({
    uuid,
    ISO8601,
    isEnumValue
  })
})

afterAll(async () => {
  if (process.env.NODE_ENV !== 'test') throw new Error('NODE_ENV must be set to test')

  await mainDataSource.manager.queryRunner?.rollbackTransaction()
  await mainDataSource.manager.queryRunner?.release()

  await mainDataSource.destroy()
})
