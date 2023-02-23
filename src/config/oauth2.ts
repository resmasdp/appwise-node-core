import type { OAuth2Server } from '@appwise/oauth2-server'
import { createOAuth2 } from '@appwise/oauth2-server'
import { ClientDefaultService } from '../components/authentication/services/client.service'
import { TokenDefaultService } from '../components/authentication/services/token.service'
import { Scope } from '../components/authentication/types'
import { UserDefaultService } from '../components/users/services/user.service'

const userService = new UserDefaultService()
const clientService = new ClientDefaultService()
const tokenService = new TokenDefaultService()

export const oauth: OAuth2Server = createOAuth2({
  scopes: Object.values(Scope),
  services: {
    userService,
    clientService,
    tokenService
  }
})
