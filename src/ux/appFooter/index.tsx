import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AssetsIcon } from '../../components/icons/AssetsIcon'
import { DefiIcon } from '../../components/icons/DefiIcon'
import { WalletIconFooter } from '../../components/icons/WalletIconFooter'
import { colors } from '../../styles/colors'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Contacts' as never)}
        style={styles.button}>
        <Text style={styles.text}>
          <DefiIcon style={styles.icon} />
          Apps
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home' as never)}
        style={styles.button}>
        <Text style={styles.text}>
          <WalletIconFooter style={styles.icon} />
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
    display: 'flex',
    flexDirection: 'row',
    // alignContent: 'center',
    // alignItems: 'center',
    // marginHorizontal: 'auto',

    backgroundColor: colors.darkBlue,
  },
  button: {
    paddingVertical: 10,
    marginHorizontal: 10,
    display: 'flex',
    alignItems: 'center',

    // justifyContent: 'center',
    flexGrow: 1,
    // width: '25%',
    borderBottomWidth: 4,
    borderColor: colors.lightPurple,
  },
  icon: {
    // alignSelf: 'baseline',
    // display: 'flex',
    // flex: 1,
    // height: 50,
    // width: 20,
    // borderColor: colors.green,
    marginRight: 10,
  },
  text: {
    color: colors.white,
    // display: 'flex',
    // flex: 5,
    // fontSize: 100,
    // borderWidth: 3,
    // borderColor: colors.green,
    textAlign: 'center',
  },
})
