import { DefaultNamingStrategy } from 'typeorm'

export class DatabaseNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return super.tableName(targetName, userSpecifiedName).replace(/_entity$/, '')
  }
}
