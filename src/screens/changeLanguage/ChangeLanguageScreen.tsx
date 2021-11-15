import React from 'react'
import { View } from 'react-native'
import { Button } from '../../components'
import { useTranslation, Trans } from 'react-i18next'
import { Paragraph } from '../../components'

export const ChangeLanguageScreen = () => {
  const { i18n } = useTranslation()

  return (
    <View>
      <Paragraph>
        <Trans>Please select your language</Trans>
      </Paragraph>
      <Button onPress={() => i18n.changeLanguage('es')} title={'ES'} />
      <Button onPress={() => i18n.changeLanguage('en')} title={'EN'} />
    </View>
  )
}
