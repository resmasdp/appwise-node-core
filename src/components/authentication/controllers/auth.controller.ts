import type { Request, Response } from 'express'
import { UserTransformer } from '../../users/transformers/user.transformer'
import { AuthenticationService, type IAuthenticationService } from '../services/auth.service'
import { TokenTransformer } from '../transformers/token.transformer'

export class AuthController {
  private readonly authService: IAuthenticationService

  constructor (authService: IAuthenticationService = new AuthenticationService()) {
    this.authService = authService

    this.createToken = this.createToken.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.revokeToken = this.revokeToken.bind(this)
  }

  public async createToken (req: Request, res: Response): Promise<void> {
    try {
      const token = await this.authService.createToken(req, res)

      res.json(new TokenTransformer().item(token))
    } catch (e) {
      res.status(e.code).json({
        error: e.name,
        error_description: e.message
      })
    }
  }

  public async getUserInfo (req: Request, res: Response): Promise<void> {
    const user = await this.authService.getUserInfo(req)

    res.json(new UserTransformer().item(user))
  }

  public async revokeToken (req: Request, res: Response): Promise<void> {
    await this.authService.revokeToken(req)

    res.sendStatus(200)
  }
}
