import type { NextFunction, Request, Response } from 'express'
import validator from 'validator'
import { KnownError } from '../../../config/errors'
import { Role } from '../models/user.model'
import { type UserService, UserDefaultService } from '../services/user.service'

export class UserMiddleware {
  private readonly userService: UserService

  constructor (userService: UserService = new UserDefaultService()) {
    this.userService = userService

    this.use = this.use.bind(this)
  }

  async use (req: Request, _res: Response, next: NextFunction, uuid: string): Promise<void> {
    if (!validator.isUUID(uuid)) throw new KnownError('invalid_uuid')

    const user = await this.userService.findOne(uuid)

    if (
      req.auth.user.uuid !== user.uuid &&
      req.auth.user.role !== Role.ADMIN
    ) throw new KnownError('unauthorized')

    next()
  }
}
