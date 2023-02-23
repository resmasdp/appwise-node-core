/* istanbul ignore file */
import type { Request, Router } from 'express'
import { DTORouter } from '@appwise/express-dto-router'

export function statusRouter (): Router {
  const router = new DTORouter()

  router.get('/', async (_req: Request) => {
    return { env: process.env.NODE_ENV }
  })

  return router.router
}
