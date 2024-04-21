import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Typography } from 'components/index'
import { sharedColors } from 'shared/constants'

export const OfflineScreen = () => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Typography
          type="h3"
          color={sharedColors.text.primary}
          style={styles.text}>
          {t('offline_screen_title')}
        </Typography>
        <Typography
          type="body2"
          color={sharedColors.text.label}
          style={styles.text}>
          {t('offline_screen_description_1')}
        </Typography>
        <Typography
          type="body2"
          color={sharedColors.text.label}
          style={styles.text}>
          {t('offline_screen_description_2')}
        </Typography>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sharedColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: sharedColors.primary,
    borderRadius: 25,
    padding: 20,
    margin: 20,
  },
  text: {
    textAlign: 'center',
    paddingVertical: 5,
  },
})
