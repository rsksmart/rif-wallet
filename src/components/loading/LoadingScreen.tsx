import React from 'react'
import { View } from 'react-native'
import { shareStyles } from '../sharedStyles'
import { Loading } from '.'

export const LoadingScreen = ({ reason }: { reason: string }) => <View style={shareStyles.coverAllScreen}>
  <Loading reason={reason} />
</View>
