import bcrypt from 'bcryptjs'
import { KnownError } from '../../../config/errors'
import type { CreateUserDTO, OpenIDUserDTO, UpdatePasswordDTO, UpdateUserDTO } from '../dtos'
import type { User } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'

export interface UserService {
  findAll: () => Promise<User[]>
  findOne: (uuid: string) => Promise<User>
  findOneByEmail: (email: string) => Promise<User>
  create: (dto: CreateUserDTO) => Promise<User>
  update: (user: User, dto: UpdateUserDTO) => Promise<User>
  verify: (email: string, password: string) => Promise<User | false>
  delete: (uuid: string) => Promise<User>
  updatePassword: (uuid: string, dto: UpdatePasswordDTO) => Promise<User>
}

export class UserDefaultService implements UserService {
  constructor (
    private readonly userRepository: UserRepository = new UserRepository()
  ) {}

  async findAll (): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne (uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } })

    if (user == null) throw new KnownError('not_found').setDesc('User not found')

    return user
  }

  async findOneByEmail (email: string): Promise<User> {
    if (email === undefined || email === null) throw new KnownError('missing_parameters').setDesc('Email parameter is required')

    email = email.toLowerCase()
    const user = await this.userRepository.findOne({ where: { email } })

    if (user === null || user === undefined) throw new KnownError('not_found').setDesc('User not found')

    return user
  }

  async create (dto: CreateUserDTO | OpenIDUserDTO): Promise<User> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } })

    if (exists !== null) throw new KnownError('email_exists')

    const user = this.userRepository.create(dto)

    user.password = await bcrypt.hash(dto.password, 10)

    return await this.userRepository.save(user)
  }

  async update (user: User, dto: UpdateUserDTO): Promise<User> {
    Object.assign(user, dto)

    return await this.userRepository.save(user)
  }

  async updatePassword (uuid: string, dto: UpdatePasswordDTO): Promise<User> {
    const user = await this.userRepository.preload({
      uuid
    })

    if (user === undefined) throw new KnownError('not_found').setDesc('User not found')

    const match = await bcrypt.compare(dto.oldPassword, user.password)

    if (!match) throw new KnownError('invalid_credentials')

    user.password = await bcrypt.hash(dto.password, 10)

    return await this.userRepository.save(user)
  }

  async delete (uuid: string): Promise<User> {
    const user = await this.findOne(uuid)
    return await this.userRepository.remove(user)
  }

  async verify (email: string, password: string): Promise<User | false> {
    try {
      const user = await this.findOneByEmail(email)
      const match = await bcrypt.compare(password, user.password)

      if (!match) return false

      return user
    } catch (e) {
      return false
    }
  }
}
