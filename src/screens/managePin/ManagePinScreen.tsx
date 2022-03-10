import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getPin, savePin } from '../../storage/PinStore'
import { DialButton } from '../../components/button/DialButton'

import { shareStyles } from '../../components/sharedStyles'
import { Trans, useTranslation } from 'react-i18next'
import { KeyPad } from '../../components/keyPad'
import { colors } from '../../styles/colors'

interface Interface {
  unlock: () => void
  route: any
  navigation: any
}

export const ManagePinScreen: React.FC<Interface> = ({ route, navigation }) => {
  const mnemonic = route.params && route.params.mnemonic

  const [error, setError] = useState<string | null>(null)
  const [pin, setPin] = React.useState<Array<string>>(['', '', '', ''])
  const [storedPin, setStoredPin] = React.useState<string | null>('')
  const [position, setPosition] = React.useState(0)

  const { t } = useTranslation()

  const storePin = (enteredPin: string) => () => {
    setError(null)
    savePin(enteredPin).then(() => {
      setPosition(4)
      setStoredPin(enteredPin)
    })
  }

  const onPressKey = (value: string) => {
    setPin(prev => {
      if (position < 4) {
        const tempPin = [...pin]
        tempPin.splice(position, 1, value)
        setPosition(position + 1)
        return tempPin
      }
      return prev
    })
  }

  const onDelete = () => {
    setError(null)
    setPin(prev => {
      if (position > 0) {
        const tempPin = [...pin]
        tempPin.splice(position - 1, 1, '')
        setPosition(position - 1)
        return tempPin
      }
      return prev
    })
  }
  getPin().then(retrievedPin => {
    setStoredPin(retrievedPin)
  })

  return (
    <View
      style={{
        ...shareStyles.coverAllScreen,
        ...styles.container,
      }}>
      <Text style={styles.header}>
        {!storedPin && <Trans>{t('Set your PIN')}</Trans>}
        {storedPin && <Trans>{t('Your pin is set')}</Trans>}
      </Text>
      <View style={styles.dotsWrapper}>
        {pin.map((digit, index) => (
          <View
            key={`${digit}${index}`}
            style={{ ...styles.dot, ...(!!digit && styles.filledDot) }}
          />
        ))}
      </View>
      <View style={styles.buttonWrapper}>
        {!!storedPin && mnemonic && (
          <DialButton
            label={'Finish'}
            testID={'finish'}
            onPress={() => navigation.navigate('KeysCreated', { mnemonic })}
          />
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {!storedPin && (
        <KeyPad
          onDelete={onDelete}
          onKeyPress={onPressKey}
          onUnlock={storePin(pin.join(''))}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 35,
  },
  container: {
    paddingHorizontal: 60,
    paddingTop: 60,
    backgroundColor: colors.darkPurple3,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 40,
    height: 30,
    marginRight: 10,
    width: 30,
  },
  filledDot: {
    backgroundColor: colors.lightPurple,
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonWrapper: {
    alignItems: 'center',
  },

  error: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
