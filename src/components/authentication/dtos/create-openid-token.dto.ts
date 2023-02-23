import { IsNotEmpty, IsString } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'

export class CreateOpenIDTokenDto extends DTO {
  @IsString()
  @IsNotEmpty()
  grant_type: string

  @IsString()
  @IsNotEmpty()
  id_token: string

  @IsString()
  @IsNotEmpty()
  client_id: string

  @IsString()
  @IsNotEmpty()
  client_secret: string
}
