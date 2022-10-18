import { wordlists } from 'bip39'
const isWordlistValid = (wordlistToValidate: string[]) => {
  for (let i = 0; wordlistToValidate.length > i; i++) {
    if (!wordlists.english.includes(wordlistToValidate[i])) {
      return false
    }
  }
  return true
}

export const validateMnemonic = (importMnemonic: string): string | null => {
  const mnemonic = importMnemonic ? importMnemonic.split(' ') : []
  if (!isWordlistValid(mnemonic)) {
    return 'worldlist is not valid'
  } else if (mnemonic.length < 12) {
    return 'you need to enter at least 12 words'
  } else {
    return null
  }
}
