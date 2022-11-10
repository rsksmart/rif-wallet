import { MMKV } from 'react-native-mmkv'

export class Store {
  private id: string = 'mmkv.default'
  private storage: MMKV | null = null

  constructor(id: string = 'mmkv.default', encryptionKey?: string) {
    this.id = id
    this.storage = new MMKV({
      id,
      encryptionKey,
    })
  }

  public set(key: string, value: any) {
    console.log('VALUE STORED', value)
    if (this.storage && typeof value !== 'undefined') {
      this.storage.set(key, JSON.stringify(value))
    }
  }

  public get(key: string = 'default') {
    if (this.storage) {
      const value = this.storage.getString(key)
      console.log('VALUE FETCHED', value)
      return value && JSON.parse(value)
    }
  }

  public has(key: string = 'default') {
    if (this.storage) {
      return this.storage.contains(key)
    } else {
      return false
    }
  }

  public delete(key: string) {
    if (this.storage) {
      this.storage.delete(key)
    }
  }

  public deleteAll() {
    if (this.storage) {
      this.storage.clearAll()
    }
  }
}
