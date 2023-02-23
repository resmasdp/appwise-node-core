import { type ValidationOptions, ValidateBy, buildMessage, isUUID } from 'class-validator'
import { type BaseEntity, Repository } from 'typeorm'
import { mainDataSource } from '../../config/sql'

export function IsEntity <T extends BaseEntity & { uuid: string }> (
  Entity: (new () => T) & typeof BaseEntity,
  // where: (value) => FindOptionsWhere<T> = value => ({ uuid: value }),
  withDeleted = false,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy({
    name: 'isEntity',
    validator: {
      validate: async (value): Promise<boolean> => {
        const repository = new Repository<T>(Entity, mainDataSource.manager)

        if (validationOptions?.each === true) {
          if (!Array.isArray(value)) return false
          for (const v of value) {
            if (!isUUID(v)) return false
            if (await repository.count({ where: { uuid: v }, withDeleted }) === 0) return false
          }
          return true
        }
        if (!isUUID(value)) return false
        return await repository.count({ where: { uuid: value }, withDeleted }) > 0
      },
      defaultMessage: buildMessage(eachPrefix => eachPrefix + `$property must be an existing ${Entity.name}`, validationOptions)
    }
  })
}
