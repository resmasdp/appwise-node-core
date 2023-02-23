/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { AuthController } from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { Scope } from '../types'

export function authRouter (): Router {
  const router: Router = Router()

  const authController = new AuthController()

  router.post('/token', authController.createToken)
  router.post('/revoke', requireAuth([Scope.READ]), authController.revokeToken)
  router.get('/userinfo', requireAuth([Scope.READ]), authController.getUserInfo)

  return router
}
