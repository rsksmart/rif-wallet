import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { setFullscreen } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'

export const CongratulationsScreen = () => {
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
  }, [dispatch, isFocused])

  return (
    <View style={styles.container}>
      <Typography type="h1" color={sharedColors.white}>
        Congratulations!
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sharedColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
