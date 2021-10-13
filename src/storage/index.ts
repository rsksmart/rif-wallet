export enum StorageKeys {
  MNEMONIC = 'mnemonic',
}

export const getStorage = (_key: StorageKeys) => {
  return Promise.resolve(
    'sausage surge pride below artefact child ketchup access damage deny fame spawn gasp reason service enough cotton cattle timber drive bacon badge sweet busy',
  )
}

export const setStorage = (key: StorageKeys, data: string) => {
  console.log('setting', key, data)
}
