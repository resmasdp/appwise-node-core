import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'
import { IsNullable } from '../../../util/validators/is-nullable.validator'

export class CreateUserDTO extends DTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsNullable()
  @IsString()
  firstName: string | null

  @IsNullable()
  @IsString()
  lastName: string | null
}
