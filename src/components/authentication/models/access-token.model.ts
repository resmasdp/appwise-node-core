import { KnownError } from '../../../config/errors'
import { signToken } from '../../../helpers/token'
import type { User } from '../../users'
import type { Client } from '..'

interface JwtPayload {
  iat?: number
  exp?: number
  uid: string
  cid: string
  role: string
  scope: string[]
}

export class AccessToken {
  exp?: number
  iat?: number

  uid: string
  cid: string
  scope: string[]

  user: Pick<User, 'uuid' | 'role'>
  client: Pick<Client, 'uuid' | 'id' | 'grants' | 'scopes'>

  get accessToken (): string {
    return signToken<JwtPayload>({
      uid: this.uid,
      cid: this.cid,
      scope: this.scope,
      role: this.user.role
    }, {
      expiresIn: AccessToken.lifetime
    })
  }

  toString (): string {
    return this.accessToken
  }

  get accessTokenExpiresAt (): Date {
    if (this.exp === undefined) throw new KnownError('invalid_token')

    return new Date(this.exp * 1000)
  }

  static get lifetime (): number {
    const value = Number(process.env.ACCESS_TOKEN_LIFETIME)

    if (isNaN(value)) return 3600
    else return value
  }
}
