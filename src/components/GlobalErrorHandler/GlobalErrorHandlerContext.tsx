import React, { createContext, useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { MediumText, RegularText } from '../typography'
import ActiveButton from '../button/ActiveButton'
import WarningIcon from '../icons/WarningIcon'

type GlobalErrorHandlerType = {
  setGlobalError: any
}

type GlobalErrorHandlerProviderType = {
  children: React.ReactNode
}

const GlobalErrorHandlerContext = createContext<GlobalErrorHandlerType>({
  setGlobalError: () => {},
})

const GlobalErrorHandlerProvider: React.FC<GlobalErrorHandlerProviderType> = ({
  children,
}) => {
  const [globalError, setGlobalError] = useState(null)
  const [compKey, setCompKey] = useState(0)
  const handleReload = () => {
    setGlobalError(null)
    setCompKey(curKey => curKey + 1)
  }
  if (globalError) {
    return (
      <View style={styles.container}>
        <View>
          <WarningIcon color="white" size={50} />
        </View>
        <MediumText style={styles.text}>There was an error</MediumText>
        <RegularText style={styles.text}>
          An error has been found. Please try reloading the app.
        </RegularText>
        <ActiveButton text="Reload" onPress={handleReload} />
      </View>
    )
  }

  return (
    <GlobalErrorHandlerContext.Provider
      value={{ setGlobalError }}
      key={compKey}>
      {children}
    </GlobalErrorHandlerContext.Provider>
  )
}

export const useSetGlobalError = () => {
  const { setGlobalError } = useContext(GlobalErrorHandlerContext)
  return setGlobalError
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    marginBottom: 20,
  },
  exclamation: {
    fontSize: 32,
  },
})

export default GlobalErrorHandlerProvider
