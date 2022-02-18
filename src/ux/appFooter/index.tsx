import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AssetsIcon } from '../../components/icons/AssetsIcon'
import { DefiIcon } from '../../components/icons/DefiIcon'
import { WalletIcon } from '../../components/icons/WalletIcon'
import { colors } from '../../styles/colors'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()
  const selected = {
    borderBottomColor: colors.blue,
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dapps' as never)}
        style={
          currentScreen === 'Dapps'
            ? { ...styles.button, ...selected }
            : styles.button
        }>
        <Text style={styles.text}>
          <DefiIcon style={styles.icon} />
          Apps
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home' as never)}
        style={
          currentScreen === 'Home'
            ? { ...styles.button, ...selected }
            : styles.button
        }>
        <Text style={styles.text}>
          <WalletIcon style={styles.icon} />
          Wallet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home' as never)}
        style={styles.button}>
        <Text style={styles.text}>
          <AssetsIcon style={styles.icon} />
          Assets
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.darkBlue,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.lightPurple,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
})
