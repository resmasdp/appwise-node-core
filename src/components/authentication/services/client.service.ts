import type { User } from '../../users'
import { UserDefaultService } from '../../users/services/user.service'
import type { Client } from '../models/client.model'
import { ClientRepository } from '../repositories/client.repository'
import { Scope } from '../types'

export interface ClientService {
  getUserFromClient: (client: Client) => Promise<User | undefined>
  getClient: (clientId: string, secret: string | null) => Promise<Client | false>
}

export class ClientDefaultService implements ClientService {
  constructor (
    private readonly clientRepository = new ClientRepository()
  ) {}

  async getUserFromClient (client: Client): Promise<User | undefined> {
    if (client.userUuid === undefined) return

    if (client.user === undefined) {
      const user = await new UserDefaultService().findOne(client.userUuid)

      if (user === undefined) return

      client.user = user
    }

    return client.user
  }

  async getClient (clientId: string, secret: string): Promise<Client | false> {
    const scopes = Object.values(Scope)
    try {
      const client = await this.clientRepository.findOne({
        where: { uuid: clientId }
      })

      if (client === null || client === undefined) return false

      if ((secret !== null && secret !== undefined) && client?.secret !== secret) return false

      if (client?.scopes?.includes(Scope.ALL)) client.scopes = scopes

      client.grants = ['password', 'refresh_token']

      return client
    } catch (e) {
      return false
    }
  }
}
