import { Dispatch, SetStateAction, useCallback } from 'react'
import { FC, ReactNode, createContext, useState, useContext } from 'react'

import GlobalErrorHandlerView from './GlobalErrorHandlerView'

interface GlobalErrorHandlerType {
  setGlobalError: Dispatch<SetStateAction<string | null>>
  globalError: string | null
  handleReload: () => void
}

interface GlobalErrorHandlerProviderType {
  children?: FC | ReactNode
  GlobalErrorHandlerViewComp?: FC
}

export const GlobalErrorHandlerContext = createContext<GlobalErrorHandlerType>({
  setGlobalError: () => {},
  globalError: null,
  handleReload: () => {},
})

const GlobalErrorHandlerProvider: React.FC<GlobalErrorHandlerProviderType> = ({
  children,
  GlobalErrorHandlerViewComp = GlobalErrorHandlerView,
}) => {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [compKey, setCompKey] = useState(0)

  const handleReload = useCallback(() => {
    setGlobalError(null)
    setCompKey(curKey => curKey + 1)
  }, [])

  return (
    <GlobalErrorHandlerContext.Provider
      value={{ setGlobalError, globalError, handleReload }}
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

export default GlobalErrorHandlerProvider
