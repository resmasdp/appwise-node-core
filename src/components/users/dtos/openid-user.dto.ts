import { IsString, MinLength } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'

export class OpenIDUserDTO extends DTO {
  @IsString()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
