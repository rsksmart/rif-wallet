import React, { createContext, useState, useContext } from 'react'
import GlobalErrorHandlerView from './GlobalErrorHandlerView'

type GlobalErrorHandlerType = {
  setGlobalError: any
  globalError: string | null
  handleReload: () => void
}

type GlobalErrorHandlerProviderType = {
  children?: React.FC<any> | React.ReactNode
  GlobalErrorHandlerViewComp?: React.FC
}

const GlobalErrorHandlerContext = createContext<GlobalErrorHandlerType>({
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
  const handleReload = () => {
    setGlobalError(null)
    setCompKey(curKey => curKey + 1)
  }

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
