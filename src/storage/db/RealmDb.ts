import Realm from 'realm'
import { Buffer } from 'buffer'

export const TransactionSchema = {
  name: 'Transaction',
  properties: {
    key: 'string',
    value: '{}',
  },
  primaryKey: 'key',
}

export const WalletSchema = {
  name: 'Wallet',
  properties: {
    key: 'string',
    value: '{}',
  },
  primaryKey: 'key',
}
export class RealmDb {
  realm: Realm | undefined = undefined

  async init(schema: Realm.ObjectSchema, privateKey: string) {
    this.realm = await Realm.open({
      schema: [schema],
      path: `${schema.name.toLowerCase()}.realm`,
      schemaVersion: 1,
      deleteRealmIfMigrationNeeded: true,
      encryptionKey: Buffer.from(privateKey),
    })
  }

  has(type: string, key: string): boolean {
    const enhancedTrx = this.realm?.objectForPrimaryKey(type, key)
    return !!enhancedTrx
  }

  get(type: string, key: string): any {
    return this.realm?.objectForPrimaryKey(type, key)
  }

  store(type: string, key: string, value: any) {
    return this.realm?.write(() => {
      this.realm?.create(
        type,
        {
          key,
          value,
        },
        Realm.UpdateMode.Modified,
      )
    })
  }

  delete(type: string, key: string) {
    this.realm?.write(() => {
      const enhancedTrx = this.realm?.objectForPrimaryKey(type, key)
      this.realm?.delete(enhancedTrx)
    })
  }

  close() {
    try {
      this.realm?.close()
    } catch (error) {
      console.error('Failed to close db', error)
    }
  }

  deleteAll() {
    this.realm?.schema.forEach(schema => {
      Realm.deleteFile({
        schema: [schema],
        path: `${schema.name.toLowerCase()}.realm`,
      })
    })
  }
}
