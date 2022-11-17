import { useState, useEffect } from 'react'
import { MixedTokenAndNetworkType } from './types'

const normalTabs = ['address', 'recent', 'contact']
const bitcoinTabs = ['address']
export const useTokenSelectedTabs = (
  tokenSelected: MixedTokenAndNetworkType,
  setCurrentTab: (tab: string) => void,
) => {
  const [tabs, setTabs] = useState<string[]>(normalTabs)

  const onTokenChanged = () => {
    if ('isBitcoin' in tokenSelected) {
      setTabs([...bitcoinTabs])
      setCurrentTab('address')
    } else {
      setTabs([...normalTabs])
    }
  }
  useEffect(() => {
    onTokenChanged()
  }, [tokenSelected])
  return {
    tabs,
  }
}
