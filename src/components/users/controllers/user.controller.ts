import type { Request } from 'express'
import type { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from '../dtos'
import { type UserService, UserDefaultService } from '../services/user.service'
import { UserTransformer, type UserTransformerType } from '../transformers/user.transformer'

export class UserController {
  private readonly userService: UserService

  constructor (userService: UserService = new UserDefaultService()) {
    this.userService = userService

    this.createUser = this.createUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.updateUserPassword = this.updateUserPassword.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.getUser = this.getUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
  }

  async createUser (req: Request, dto: CreateUserDTO): Promise<UserTransformerType> {
    const user = await this.userService.create(dto)

    return new UserTransformer().item(user)
  }

  async getUsers (_req: Request): Promise<UserTransformerType[]> {
    const users = await this.userService.findAll()

    return new UserTransformer().array(users)
  }

  async getUser (req: Request): Promise<UserTransformerType> {
    const user = await this.userService.findOne(req.params.user)

    return new UserTransformer().item(user)
  }

  async updateUser (req: Request, dto: UpdateUserDTO): Promise<UserTransformerType> {
    const user = await this.userService.findOne(req.auth.user.uuid)

    await this.userService.update(user, dto)

    return new UserTransformer().item(user)
  }

  async deleteUser (req: Request): Promise<void> {
    const user = await this.userService.findOne(req.auth.user.uuid)

    await this.userService.delete(user.uuid)
  }

  async updateUserPassword (req: Request, dto: UpdatePasswordDTO): Promise<void> {
    const user = await this.userService.findOne(req.auth.user.uuid)

    await this.userService.updatePassword(user.uuid, dto)
  }
}
