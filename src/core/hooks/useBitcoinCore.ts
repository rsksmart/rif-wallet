import { useMemo } from 'react'
import BitcoinCore from '../../lib/bitcoin/BitcoinCore'

const useBitcoinCore = (mnemonic: string) => {
  return useMemo(() => {
    if (!mnemonic) {
      return null
    }
    return new BitcoinCore(mnemonic)
  }, [mnemonic])
}

export default useBitcoinCore
