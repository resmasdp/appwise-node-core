import type { Server } from 'http'
import express, { type Express } from 'express'
import cors from 'cors'
import { Handlers } from '@sentry/node'
import { DTOErrorHandler } from '@appwise/express-dto-router'
import { createRouter } from '../routes'
import { init } from '../config/sentry'
import { migrate } from '../config/sql/util/migrate'
import { mainDataSource } from '../config/sql'

function createApp (): Express {
  const app = express()

  init(app)

  app.use(Handlers.requestHandler({ ip: true }))
  app.use(Handlers.tracingHandler())

  app.use(cors())

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json({
    limit: '4mb'
  }))

  app.use(createRouter())

  app.use(DTOErrorHandler())
  app.use(Handlers.errorHandler())
  app.use((_err, _req, _res, _next) => { /* no error */ })

  return app
}

export class Runner {
  server: Server

  async start (app: express.Application): Promise<void> {
    await mainDataSource.initialize()
    await migrate(mainDataSource)

    // eslint-disable-next-line no-console
    this.server = app.listen(3000, () => { console.log('server started at *:3000') })

    process.on('SIGINT', () => { void this.close() })
    process.on('SIGTERM', () => { void this.close() })
  }

  async close (): Promise<void> {
    this.server?.close()

    if (mainDataSource.isInitialized) await mainDataSource.destroy()

    // eslint-disable-next-line no-console
    console.log('server closed')
  }
}

export default createApp

if (require.main === module) {
  const runner = new Runner()

  const app = createApp()

  void runner.start(app)
}
