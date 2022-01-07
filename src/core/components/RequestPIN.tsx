import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getPin } from '../../storage/PinStore'

import { Paragraph } from '../../components/typography'
import { Button } from '../../components/button'
import { shareStyles } from '../../components/sharedStyles'
import { CustomInput } from '../../components'
import { Trans, useTranslation } from 'react-i18next'

interface Interface {
  unlock: () => void
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const [inputtedPin, setInputtedPin] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <View
      style={{
        ...shareStyles.coverAllScreen,
        ...styles.container,
      }}>
      <Text style={styles.header}>
        <Trans>Enter your pin</Trans>
      </Text>
      <Text style={styles.header}>
        <Trans>to unlock the app</Trans>
      </Text>

      <View style={styles.marginBottom}>
        <CustomInput
          onChange={pin => !isLoading && setInputtedPin(pin)}
          placeholder={t('Pin')}
          testID={'To.Input'}
          keyboardType="numeric"
        />
      </View>

      <View>
        <Button
          onPress={() => checkPin(inputtedPin)}
          title={t('Unlock')}
          testID="Next.Button"
          disabled={isLoading}
        />
      </View>
      {error && <Paragraph>{error}</Paragraph>}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  container: {
    marginHorizontal: 25,
    marginTop: 30,
  },
  marginBottom: { marginBottom: 10 },
})
