import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'

export class UpdatePasswordDTO extends DTO {
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @MinLength(6)
  password: string
}
