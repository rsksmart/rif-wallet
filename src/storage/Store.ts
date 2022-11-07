import { MMKV } from 'react-native-mmkv'

export class Store {
  private id: string
  private storage: MMKV

  constructor(id: string, encryptionKey?: string) {
    this.id = id
    this.storage = new MMKV({
      id,
      encryptionKey,
    })
  }

  public set(value: any, key: string = 'default') {
    if (typeof value !== 'undefined') {
      this.storage.set(key, JSON.stringify(value))
    }
  }

  public get(key: string = 'default') {
    return JSON.parse(this.storage.getString(key)!)
  }

  public has(key: string = 'default') {
    return this.storage.contains(key)
  }

  public delete(key: string) {
    this.storage.delete(key)
  }

  public deleteAll() {
    this.storage.clearAll()
  }
}
