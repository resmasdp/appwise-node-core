import { Repository } from 'typeorm'
import { mainDataSource } from '../../../config/sql'
import { RefreshToken } from '../models/refresh-token.model'

export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor () {
    super(RefreshToken, mainDataSource.manager)
  }
}
