import { IsNotEmpty, IsString } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'
import { IsNullable } from '../../../util/validators/is-nullable.validator'

export class CreateTokenDto extends DTO {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  client_id: string

  @IsString()
  @IsNotEmpty()
  grant_type: string

  @IsString()
  @IsNotEmpty()
  client_secret: string

  @IsNullable()
  scope: string | null
}
