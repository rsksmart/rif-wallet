import { MMKV } from 'react-native-mmkv'

export class MMKVStorage {
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
    if (this.storage && typeof value !== 'undefined') {
      this.storage.set(key, JSON.stringify(value))
    }
  }

  public get(key: string = 'default') {
    if (this.storage) {
      const value = this.storage.getString(key)
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
