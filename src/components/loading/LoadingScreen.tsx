import { Modal, StyleSheet, View } from 'react-native'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppSpinner } from 'components/index'

interface Props {
  isVisible: boolean
}

export const LoadingScreen = ({ isVisible }: Props) => {
  return (
    <Modal animationType="none" transparent visible={isVisible}>
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
    backgroundColor: sharedColors.black,
  }),
})
