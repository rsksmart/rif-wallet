import { Modal, StyleSheet, View } from 'react-native'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppSpinner } from 'components/index'

export const LoadingScreen = () => {
  return (
    <Modal animationType="none" transparent={true} visible={true}>
      <View
        style={[
          sharedStyles.flex,
          sharedStyles.contentCenter,
          styles.activityIndicatorViewStyle,
        ]}>
        <AppSpinner color="white" size={150} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  activityIndicatorViewStyle: castStyle.view({
    backgroundColor: sharedColors.secondary,
  }),
})
