import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { Button, CustomInput } from '../../components'
import { Trans, useTranslation } from 'react-i18next'
import { hasPin, savePin, removePin } from '../../storage/PinStore'

export const ManagePinScreen = () => {
  const [pin, setPin] = useState('')
  const [pinSaved, setPinSaved] = useState(false)
  useEffect(() => {
    const callStorage = async () => {
      const pinSet = await hasPin()
      setPinSaved(pinSet || false)
      return pinSet
    }

    callStorage().then(pinSet => console.log(pinSet))
  }, [])

  const { t } = useTranslation()

  const saveMyPin = (newPin: string) => {
    setPinSaved(true)
    savePin(newPin)
  }
  const removeMyPin = () => {
    setPinSaved(false)
    removePin()
  }
  return (
    <ScrollView>
      {pinSaved && (
        <View style={styles.container}>
          <Text style={{ ...styles.header, ...styles.marginBottom }}>
            <Trans>Your pin is set</Trans>
          </Text>
          <Button onPress={() => removeMyPin()} title={t('Delete your Pin')} />
        </View>
      )}

      {!pinSaved && (
        <View style={styles.container}>
          <Text style={{ ...styles.header, ...styles.marginBottom }}>
            <Trans>Set your pin</Trans>
          </Text>
          <View style={styles.marginBottom}>
            <CustomInput
              onChange={setPin}
              placeholder={t('Pin')}
              testID={'To.Input'}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Button
              onPress={() => saveMyPin(pin)}
              title={t('Save')}
              testID="Next.Button"
            />
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 30,
  },
  marginBottom: { marginBottom: 10 },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
})
