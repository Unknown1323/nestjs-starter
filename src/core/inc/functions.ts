import { plainToClassFromExist } from 'class-transformer'

export function constructDto<T>(classObject: T, initData: unknown): T {
  return plainToClassFromExist(classObject, initData, {
    strategy: 'excludeAll',
  })
}
