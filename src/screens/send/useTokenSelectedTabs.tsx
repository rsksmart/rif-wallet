import { useState, useEffect, useCallback } from 'react'
import { MixedTokenAndNetworkType } from './types'

const normalTabs = ['address', 'recent', 'contact']
const bitcoinTabs = ['address']
export const useTokenSelectedTabs = (
  tokenSelected: MixedTokenAndNetworkType,
  setCurrentTab: (tab: string) => void,
) => {
  const [tabs, setTabs] = useState<string[]>(normalTabs)

  const onTokenChanged = useCallback(() => {
    if ('isBitcoin' in tokenSelected) {
      setTabs([...bitcoinTabs])
      setCurrentTab('address')
    } else {
      setTabs([...normalTabs])
    }
  }, [setCurrentTab, tokenSelected])

  useEffect(() => {
    onTokenChanged()
  }, [onTokenChanged])
  return {
    tabs,
  }
}
