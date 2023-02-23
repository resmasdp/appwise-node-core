import { randEmail, randFirstName, randLastName, randPassword } from '@ngneat/falso'
import bcrypt from 'bcryptjs'
import type { SeederOptions } from '../../../config/tests/setup'
import type { Client } from '../../authentication'
import { TokenDefaultService } from '../../authentication/services/token.service'
import { getTestClient } from '../../authentication/tests/client.seeder'
import type { Role, User } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'

export async function setupUser (role?: Role): Promise<{
  user: User
  client: Client
  token: string
}> {
  const tokenService = new TokenDefaultService()

  const client = await getTestClient()

  const user = await createRandomUser({ save: true }, role)

  const token = await tokenService.generateAccessToken(client, user, ['read', 'write'])

  return { user, client, token }
}

export async function createRandomUser (options?: SeederOptions, role?: Role): Promise<User> {
  const userRepository = new UserRepository()

  const password = randPassword()

  const user = userRepository.create({
    email: randEmail(),
    password: await bcrypt.hash(password, 10),
    firstName: randFirstName(),
    lastName: randLastName(),
    role
  })

  if (options?.save === true) {
    await userRepository.save(user)
  }

  return user
}
