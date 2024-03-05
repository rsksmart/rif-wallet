import { MMKV } from 'react-native-mmkv'
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin'

export type AcceptedValue = boolean | string | number | object

export class MMKVStorage {
  private id: string
  private storage: MMKV

  constructor(id = 'mmkv.default', encryptionKey?: string) {
    this.id = id
    this.storage = new MMKV({
      id,
      encryptionKey,
    })

    if (__DEV__) {
      initializeMMKVFlipper({ default: this.storage })
    }
  }

  public set(key: string, value: AcceptedValue) {
    if (typeof value !== 'undefined') {
      this.storage.set(key, JSON.stringify(value))
    }
  }

  public get(key = 'default') {
    const value = this.storage.getString(key)
    return value && JSON.parse(value)
  }

  public has(key = 'default') {
    return this.storage.contains(key)
  }

  public delete(key: string) {
    this.storage.delete(key)
  }

  public deleteAll() {
    this.storage.clearAll()
  }

  public getAllKeys() {
    return this.storage.getAllKeys() || []
  }
}
