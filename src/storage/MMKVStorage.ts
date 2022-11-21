import { MMKV } from 'react-native-mmkv'

type AcceptedValue = boolean | string | number | object

export class MMKVStorage {
  private id = 'mmkv.default'
  private storage: MMKV | null = null

  constructor(id = 'mmkv.default', encryptionKey?: string) {
    this.id = id
    this.storage = new MMKV({
      id,
      encryptionKey,
    })
  }

  public set(key: string, value: AcceptedValue) {
    if (this.storage && typeof value !== 'undefined') {
      this.storage.set(key, JSON.stringify(value))
    }
  }

  public get(key = 'default') {
    if (this.storage) {
      const value = this.storage.getString(key)
      return value && JSON.parse(value)
    }
  }

  public has(key = 'default') {
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
