import * as englishWordlistObj from '../../lib/bitcoinjs/bip39/wordlists/english.json'
const englishWordlist = Object.values(englishWordlistObj)

export const isWordlistValid = (wordlistToValidate: string[]) => {
  console.log({ englishWordlist })
  for (let i = 0; wordlistToValidate.length > i; i++) {
    if (!englishWordlist.includes(wordlistToValidate[i])) {
      return false
    }
  }
  return true
}
