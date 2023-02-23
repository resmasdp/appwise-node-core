import type { NextFunction, Request, Response } from 'express'
import * as OAuth2Server from '@appwise/oauth2-server'
import { KnownError } from '../../../config/errors'
import type { User } from '../../users/models/user.model'
import type { Client } from '../models/client.model'
import { oauth } from '../../../config/oauth2'
import { Scope } from '../types'

interface OurToken extends OAuth2Server.Token {
  user: User
  client: Client
  scope: string[]
}

declare module 'express' {
  export interface Request {
    auth: OurToken
  }
}

export function requireAuth (scopes?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    oauth.authenticate(request, response)
      .then(authres => {
        req.auth = authres as OurToken
        if (scopes === null || scopes === undefined) next()
        else if (
          scopes !== null &&
          ((authres?.scope !== undefined && authres.scope.includes(Scope.ALL)) ||
          scopes?.every(scope => authres.scope?.includes(scope)))
        ) next()
        else throw new KnownError('missing_scope')
      })
      .catch(err => { next(err) })
  }
}
