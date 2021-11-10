import React from 'react'
import { View } from 'react-native'
import { Button } from '../button'
import { useTranslation } from 'react-i18next'

export const Languages = () => {
  const { t, i18n } = useTranslation()

  return (
    <View>
      <Button onPress={() => i18n.changeLanguage('es')} title={'ES'} />
      <Button onPress={() => i18n.changeLanguage('en')} title={'EN'} />
    </View>
  )
}
