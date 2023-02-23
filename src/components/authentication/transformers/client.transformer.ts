import { Transformer } from '@appwise/express-dto-router'
import type { Client } from '../models/client.model'

interface ClientTransformerType {
  uuid: string
  createdAt: Date
  updatedAt: Date
  name: string
  redirectUris: string[]
  grants: string[]
  scopes: string[]
}
export class ClientTransformer extends Transformer<Client, ClientTransformerType> {
   transform (client: Client): ClientTransformerType {
    return {
      uuid: client.uuid,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      redirectUris: client.redirectUris,
      grants: client.grants,
      scopes: client.scopes
    }
  }
}
