import { DTORouter } from '@appwise/express-dto-router'
import type { Router } from 'express'
import { requireAuth } from '../../authentication/middlewares/auth.middleware'
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from '../dtos'
import { UserController } from '../controllers/user.controller'
import { UserMiddleware } from '../middlewares/user.middleware'
import { Scope } from '../../authentication/types'

export function userRouter (): Router {
  const userController = new UserController()
  const userMiddleware = new UserMiddleware()

  const router = new DTORouter()

  router.post2({
    path: '/',
    dto: CreateUserDTO,
    controller: userController.createUser
  })

  router.use(requireAuth())

  router.param('user', userMiddleware.use)

  router.get2({
    path: '/',
    middleware: [requireAuth([Scope.READ])],
    controller: userController.getUsers
  })

  router.get2({
    path: '/:user',
    middleware: [requireAuth([Scope.READ])],
    controller: userController.getUser
  })

  router.post2({
    path: '/:user',
    dto: UpdateUserDTO,
    middleware: [requireAuth([Scope.WRITE])],
    controller: userController.updateUser
  })

  router.post2({
    path: '/:user/password',
    dto: UpdatePasswordDTO,
    middleware: [requireAuth([Scope.WRITE])],
    controller: userController.updateUserPassword
  })

  router.delete2({
    path: '/:user',
    middleware: [requireAuth([Scope.WRITE])],
    controller: userController.deleteUser
  })

  return router.router
}
