import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { MediumText } from '../../components'
import { colors } from '../../styles'

export const WaitingOnUserScreen: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Image source={require('../../images/transferWait.png')} />
      <MediumText style={styles.loadingLabel}>transferring ...</MediumText>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkPurple3,
    height: '100%',
  },
  content: {
    alignSelf: 'center',
    borderColor: colors.white,
    borderRadius: 2,
  },
  loadingLabel: {
    alignSelf: 'center',
    color: colors.white,
    marginTop: 10,
  },
})
