import { IsNotEmpty, IsString } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'

export class RefreshTokenDTO extends DTO {
  @IsString()
  @IsNotEmpty()
  client_id: string

  @IsString()
  @IsNotEmpty()
  grant_type: string

  @IsString()
  @IsNotEmpty()
  refresh_token: string
}
