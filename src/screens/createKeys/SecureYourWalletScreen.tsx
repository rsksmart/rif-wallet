import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CreateKeysScreenProps } from '../../navigation/createKeysNavigator/types'
import { colors } from '../../styles'

import { Arrow } from '../../components/icons'
import { grid } from '../../styles'

import { PrimaryButton2 } from '../../components/button/PrimaryButton2'
import { SecondaryButton2 } from '../../components/button/SecondaryButton2'
import { RIFWallet } from '../../lib/core'
import { saveKeyVerificationReminder } from '../../storage/MainStorage'
import { WINDOW_HEIGHT } from '../../ux/slides/Dimensions'
type SecureYourWalletProps = {
  mnemonic: string
  createWallet: (mnemonic: string) => Promise<RIFWallet>
}
export const SecureYourWalletScreen: React.FC<
  CreateKeysScreenProps<'SecureYourWallet'> & SecureYourWalletProps
> = ({ navigation, createWallet, mnemonic }) => {
  const secureLater = async () => {
    saveKeyVerificationReminder(true)
    createWallet(mnemonic)
  }
  return (
    <View style={styles.parent}>
      <TouchableOpacity onPress={() => navigation.navigate('CreateKeys')}>
        <View style={styles.returnButtonView}>
          <Arrow color={colors.white} rotate={270} width={30} height={30} />
        </View>
      </TouchableOpacity>
      <View style={styles.itemContainer}>
        <Image
          style={styles.securitySafeImage}
          source={require('../../images/safe.png')}
        />
        <View style={{ ...grid.row, ...styles.section }}>
          <Text style={styles.title}>Secure your wallet</Text>
        </View>
        <View style={{ ...grid.row, ...styles.section }}>
          <Text style={styles.subTitle}>
            Before you create your wallet, we advise you to generate and store
            your <Text style={styles.bold}>unique Master Key</Text>
          </Text>
        </View>
        <View style={{ ...grid.row, ...styles.section }}>
          <Text style={styles.subTitle}>
            This key will help you restore your wallet and access your funds on
            a new devise, in case the old one was lost or stolen
          </Text>
        </View>
      </View>

      <View style={{ ...grid.row, ...styles.section }}>
        <PrimaryButton2
          onPress={() => navigation.navigate('SecurityExplanation')}
          accessibilityLabel="secureNow"
          title={'secure now'}
        />
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <SecondaryButton2
          onPress={secureLater}
          accessibilityLabel="secureLater"
          title={'secure later'}
        />
      </View>
      {/*
        <View style={{ ...grid.row, ...styles.button2 }}>
          <WhiteButton
            onPress={() => console.log('TODO in different PR')}
            testID="Address.ShareButton"
            title={'secure later'}
          />
        </View>
        */}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.lightPurple,
    height: '100%',
  },
  returnButtonView: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 15,
    marginBottom: 0,
    backgroundColor: colors.blue,
  },

  title: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  subTitle: {
    color: colors.black,
    fontSize: 16,
    marginHorizontal: 32,
    marginBottom: 5,
  },

  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightPurple,
    marginBottom: 30,
  },

  securitySafeImage: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.27),
    marginBottom: 10,
  },
  section: {
    alignSelf: 'center',
    marginVertical: 5,
  },
})
