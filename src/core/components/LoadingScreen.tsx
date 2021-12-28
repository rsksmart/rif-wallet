import React from 'react'
import { StyleSheet, View } from 'react-native'

import { shareStyles } from '../../components/sharedStyles'
import { Loading } from '../../components/loading'

export const LoadingScreen = ({ reason }: { reason: string }) => (
  <View style={{ ...shareStyles.coverAllScreen, ...styles.container }}>
    <Loading reason={reason} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 30,
  },
})
