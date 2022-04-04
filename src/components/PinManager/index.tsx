import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { shareStyles } from '../sharedStyles'
import { Trans, useTranslation } from 'react-i18next'
import { KeyPad } from '../keyPad'
import { colors } from '../../styles/colors'

interface Interface {
  title: string
  handleSubmit: (enteredPin: string) => Promise<string>
}
export const PinManager: React.FC<Interface> = ({ title, handleSubmit }) => {
  const [error, setError] = useState<string | null>(null)
  const [pin, setPin] = React.useState<Array<string>>(['', '', '', ''])
  const [position, setPosition] = React.useState(0)

  const { t } = useTranslation()

  const onSubmit = (enteredPin: string) => () => {
    setError(null)
    handleSubmit(enteredPin).then((response: string) => {
      if (response === 'incorrect pin') {
        setError('incorrect pin')
        setPin(['', '', '', ''])
        setPosition(0)
      }
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

  return (
    <View
      style={{
        ...shareStyles.coverAllScreen,
        ...styles.container,
      }}>
      <Text style={styles.header}>
        <Trans>{t(title)}</Trans>
      </Text>
      <View style={styles.dotsWrapper}>
        {pin.map((digit, index) => (
          <View
            key={`${digit}${index}`}
            style={{ ...styles.dot, ...(!!digit && styles.filledDot) }}
          />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <KeyPad
        onDelete={onDelete}
        onKeyPress={onPressKey}
        onUnlock={onSubmit(pin.join(''))}
      />
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
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
