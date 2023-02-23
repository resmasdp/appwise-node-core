import { Client } from '../models/client.model'
import { ClientRepository } from '../repositories/client.repository'

export async function getTestClient (): Promise<Client> {
  const clientRepository = new ClientRepository()

  let client = await clientRepository.findOneBy({ name: 'test-env' })

  if (client === null) {
    client = new Client()
    client.name = 'test-env'
    client.scopes = ['read', 'write']

    await clientRepository.save(client)
  }

  return client
}
