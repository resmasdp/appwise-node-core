import { Repository } from 'typeorm'
import { mainDataSource } from '../../../config/sql'
import { Client } from '../models/client.model'

export class ClientRepository extends Repository<Client> {
  constructor () {
    super(Client, mainDataSource.manager)
  }
}
