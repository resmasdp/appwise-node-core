import { Repository } from 'typeorm'
import { mainDataSource } from '../../../config/sql'
import { User } from '../models/user.model'

export class UserRepository extends Repository<User> {
  constructor () {
    super(User, mainDataSource.manager)
  }
}
