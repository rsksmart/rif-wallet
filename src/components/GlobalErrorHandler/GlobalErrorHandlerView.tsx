import React from 'react'
import { StyleSheet, View } from 'react-native'
import WarningIcon from '../icons/WarningIcon'
import { MediumText, RegularText } from '../typography'
import ActiveButton from '../button/ActiveButton'
import { useGlobalErrorContext } from './GlobalErrorHandlerContext'

export type GlobalErrorHandlerViewType = {} | undefined

const GlobalErrorHandlerView: React.FC<GlobalErrorHandlerViewType> = () => {
  const { handleReload } = useGlobalErrorContext()
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  text: {
    color: 'white',
    marginBottom: 20,
  },
  exclamation: {
    fontSize: 32,
  },
})

export default GlobalErrorHandlerView
