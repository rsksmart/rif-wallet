import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getPin } from '../../storage/PinStore'

import { Button } from '../../components/button'
import { shareStyles } from '../../components/sharedStyles'
import { Trans, useTranslation } from 'react-i18next'
import { DialButton } from '../../components/button/DialButton'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'

interface Interface {
  unlock: () => void
}

interface IButton {
  label: string
  variant: 'default' | 'error' | 'success'
}

interface IDigit {
  value: string
  isFilled: boolean
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const [inputtedPin, setInputtedPin] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [pin, setPin] = React.useState<Array<IDigit>>([
    { value: '', isFilled: false },
    { value: '', isFilled: false },
    { value: '', isFilled: false },
    { value: '', isFilled: false },
  ])

  const { t } = useTranslation()

  const checkPin = (enteredPin: string) => {
    setError(null)
    setIsLoading(true)

    getPin().then(storedPin => {
      if (storedPin === enteredPin) {
        return unlock()
      }
      setIsLoading(false)
      setError('incorrect pin')
    })
  }

  const buttons: Array<IButton> = [
    { label: '1', variant: 'default' },
    { label: '2', variant: 'default' },
    { label: '3', variant: 'default' },
    { label: '4', variant: 'default' },
    { label: '5', variant: 'default' },
    { label: '6', variant: 'default' },
    { label: '7', variant: 'default' },
    { label: '8', variant: 'default' },
    { label: '9', variant: 'default' },
    { label: 'DEL', variant: 'error' },
    { label: '0', variant: 'default' },
    { label: 'OK', variant: 'success' },
  ]

  const onPress = (value: string) => () => {
    if (!isLoading) {
      setInputtedPin(prev => {
        if (value === 'DEL') {
          return prev.slice(0, -1)
        }
        return `${prev}${value}`
      })
    }
  }

  return (
    <View
      style={{
        ...shareStyles.coverAllScreen,
        ...styles.container,
      }}>
      <Text style={styles.header}>
        <Trans>Confirm your PIN</Trans>
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {pin.map(digit => (
          <View key={digit.value} style={styles.dot} />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={{ ...grid.row, flexWrap: 'wrap' }}>
        {buttons.map(button => (
          <View
            key={button.label}
            style={{
              ...grid.column4,
              alignContent: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingVertical: 6.5,
              paddingHorizontal: 15,
            }}>
            <DialButton
              label={button.label}
              variant={button.variant}
              onPress={onPress(button.label)}
            />
          </View>
        ))}
      </View>
      <View>
        <Button
          onPress={() => checkPin(inputtedPin)}
          title={t('Unlock')}
          testID="Next.Button"
          disabled={isLoading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  container: {
    marginHorizontal: 25,
    marginTop: 30,
    backgroundColor: colors.darkPurple3,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 40,
    height: 30,
    marginRight: 10,
    width: 30,
  },
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
