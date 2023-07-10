import { StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import { sharedColors } from 'shared/constants'

export const OfflineScreen = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Typography type="h3" color={sharedColors.white} style={styles.text}>
        Ops! You are offline.
      </Typography>
      <Typography
        type="body2"
        color={sharedColors.labelLight}
        style={styles.text}>
        RIF Wallet needs an internet connection to work properly.
      </Typography>
      <Typography
        type="body2"
        color={sharedColors.labelLight}
        style={styles.text}>
        Please check your connection and try again.
      </Typography>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sharedColors.secondary,
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
