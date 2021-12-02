import { wordlists } from 'bip39'
export const isWordlistValid = (wordlistToValidate: string[]) => {
  for (let i = 0; wordlistToValidate.length > i; i++) {
    if (!wordlists.english.includes(wordlistToValidate[i])) {
      return false
    }
  }
  return true
}
