import * as OAuth2Server from '@appwise/oauth2-server'
import type { Request, Response } from 'express'
import { oauth } from '../../../config/oauth2'
import type { User } from '../../users/models/user.model'
import type { RefreshToken } from '../models/refresh-token.model'
import { TokenDefaultService, type TokenService } from './token.service'

export interface IAuthenticationService {
  createToken: (req: Request, res: Response) => Promise<OAuth2Server.Token>
  getUserInfo: (req: Request) => Promise<User>
  revokeToken: (req: Request) => Promise<RefreshToken | false>
}

export class AuthenticationService implements IAuthenticationService {
  constructor (
    private readonly tokenService: TokenService = new TokenDefaultService()
  ) {}

  async createToken (req: Request, res: Response): Promise<OAuth2Server.Token> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    const token = await oauth.token(request, response, {
      requireClientAuthentication: {
        refresh_token: false
      }
    })

    return token
  }

  async getUserInfo (req: Request): Promise<User> {
    return req.auth.user
  }

  async revokeToken (req: Request): Promise<RefreshToken | false> {
    const token = await this.tokenService.getRefreshToken(req.body.refreshToken)

    if (token === false) return false

    await this.tokenService.revokeToken(token)

    return token
  }
}
