import Realm from "realm"

const TransactionSchema = {
  name: 'Transaction',
  properties: {
    hash: 'string',
    value: '{}',
  },
  primaryKey:'hash'
}
export class RealmDb {

  private realm: Realm | undefined = undefined;

  async init() {
    this.realm = await Realm.open({
      schema: [TransactionSchema],
      deleteRealmIfMigrationNeeded: true
    })
  }
  
  has(hash: string) :boolean {
    const enhancedTrx = this.realm?.objectForPrimaryKey(TransactionSchema.name, hash)
    return !!enhancedTrx
  }

  get(hash: string) {
    return this.realm?.objectForPrimaryKey(TransactionSchema.name, hash)

  }

  store(hash: string, value: any) {
    return this.realm?.write(() => {
      this.realm?.create(TransactionSchema.name, {
        hash,
        value
      })
    })
  }

  delete(hash: string) {
    this.realm?.write( () => {
      const enhancedTrx = this.realm?.objectForPrimaryKey(TransactionSchema.name, hash)
      this.realm?.delete(enhancedTrx)
    })
  }

}