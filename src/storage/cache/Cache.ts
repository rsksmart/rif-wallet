import { MMKV } from 'react-native-mmkv'

export class Cache {
  private id: string
  private cache: MMKV

  constructor(id: string, encryptionKey: string) {
    this.id = id
    this.cache = new MMKV({
      id,
      encryptionKey,
    })
  }

  public set(key: string, value: any) {
    if (typeof value !== 'undefined') {
      this.cache.set(key, JSON.stringify(value))
    }
  }

  public get(key: string) {
    return JSON.parse(this.cache.getString(key)!)
  }

  public has(key: string) {
    return this.cache.contains(key)
  }

  public deleteAll() {
    this.cache.clearAll()
  }
}
