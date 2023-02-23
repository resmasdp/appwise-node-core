/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Transformer } from '@appwise/express-dto-router'
import type * as OAuth2Server from '@appwise/oauth2-server'
import type { OAuth2TokenType } from '../types/oauth2-token.type'

export interface AccessTokenTransformerType {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}
export class TokenTransformer extends Transformer<OAuth2Server.Token, AccessTokenTransformerType> {
  transform (token: OAuth2Server.Token): AccessTokenTransformerType {
    const item: OAuth2TokenType = ({
      access_token: token.accessToken,
      token_type: 'Bearer',
      expires_in: Math.floor((token.accessTokenExpiresAt!.getTime() - Date.now()) / 1000),
      refresh_token: token.refreshToken!
    })

    return item
  }
}
