import React from 'react'
import { View } from 'react-native'

import { shareStyles } from '../../components/sharedStyles'
import { Loading } from '../../components/loading'

export const LoadingScreen = ({ reason }: { reason: string }) => (
  <View style={shareStyles.coverAllScreen}>
    <Loading reason={reason} />
  </View>
)
