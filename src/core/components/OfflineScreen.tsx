import { StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import { sharedColors } from 'shared/constants'

export const OfflineScreen = () => (
  <View style={[styles.container]}>
    <Typography type="h1" color={sharedColors.dangerLight}>
      Device is offline
    </Typography>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sharedColors.black,
  },
})
