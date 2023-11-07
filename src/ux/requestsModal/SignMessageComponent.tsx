import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { Typography } from 'src/components'
import { castStyle } from 'shared/utils'

interface Props {
  message: string
}

export const SignMessageComponent = ({ message }: Props) => {
  const { t } = useTranslation()

  return (
    <Typography type={'h3'} style={styles.typographyRowStyle}>
      {t('Message')}: {message.toString() || ''}
    </Typography>
  )
}

const styles = StyleSheet.create({
  typographyRowStyle: castStyle.text({
    marginBottom: 20,
  }),
})
