import { IsString } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'
import { IsNullable } from '../../../util/validators/is-nullable.validator'

export class UpdateUserDTO extends DTO {
  @IsString()
  @IsNullable()
  firstName: string | null

  @IsString()
  @IsNullable()
  lastName: string | null
}
