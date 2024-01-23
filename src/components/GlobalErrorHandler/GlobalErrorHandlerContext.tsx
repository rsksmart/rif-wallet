import { Dispatch, SetStateAction } from 'react'
import { FC, ReactNode, createContext, useState, useContext } from 'react'
import { Magic } from '@magic-sdk/react-native-bare'
import Config from 'react-native-config'

import { getWalletSetting } from 'src/core/config'
import { SETTINGS } from 'src/core/types'
import { getCurrentChainId } from 'src/storage/ChainStorage'

import GlobalErrorHandlerView from './GlobalErrorHandlerView'

const createGlobalMagicInstance = () => {
  return new Magic(Config.MAGIC_API_KEY, {
    network: {
      rpcUrl: getWalletSetting(SETTINGS.RPC_URL, getCurrentChainId()),
      chainId: getCurrentChainId(),
    },
  })
}

interface GlobalErrorHandlerType {
  globalError: string | null
  globalMagicInstance: Magic
  setGlobalError: Dispatch<SetStateAction<string | null>>
  handleReload: () => void
}

interface GlobalErrorHandlerProviderType {
  children?: FC | ReactNode
  GlobalErrorHandlerViewComp?: FC
}

export const GlobalErrorHandlerContext = createContext<GlobalErrorHandlerType>({
  globalError: null,
  globalMagicInstance: {} as Magic,
  setGlobalError: () => {},
  handleReload: () => {},
})

const GlobalErrorHandlerProvider: React.FC<GlobalErrorHandlerProviderType> = ({
  children,
  GlobalErrorHandlerViewComp = GlobalErrorHandlerView,
}) => {
  const [globalMagicInstance, setGlobalMagicInstance] = useState<Magic>(
    createGlobalMagicInstance(),
  )
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [compKey, setCompKey] = useState(0)

  const handleReload = () => {
    setGlobalError(null)
    const newInstance = createGlobalMagicInstance()
    setGlobalMagicInstance(newInstance)
    setCompKey(curKey => curKey + 1)
  }

  return (
    <GlobalErrorHandlerContext.Provider
      value={{ setGlobalError, globalError, handleReload, globalMagicInstance }}
      key={compKey}>
      {globalError ? <GlobalErrorHandlerViewComp /> : children}
    </GlobalErrorHandlerContext.Provider>
  )
}

export const useGlobalErrorContext = () => {
  return useContext(GlobalErrorHandlerContext)
}

export const useSetGlobalError = () => {
  const { setGlobalError } = useGlobalErrorContext()
  return setGlobalError
}

export const useGlobalMagicInstance = () => {
  const { globalMagicInstance } = useGlobalErrorContext()
  return globalMagicInstance
}

export default GlobalErrorHandlerProvider
