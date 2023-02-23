import { Router } from 'express'

import { authRouter } from '../components/authentication/routers/auth.router'
import { userRouter } from '../components/users/routers/user.router'
import { docsRouter } from './docs.router'
import { statusRouter } from './status.router'

export function createRouter (): Router {
  const router: Router = Router()

  router.use('/api', statusRouter())
  router.use('/api/auth', authRouter())
  router.use('/api/v1/users', userRouter())
  router.use('/api/v1/docs', docsRouter())

  return router
}
