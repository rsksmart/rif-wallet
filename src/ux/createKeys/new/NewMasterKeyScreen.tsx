import React, { useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { CopyComponent } from '../../../components'
import { CreateKeysProps, ScreenProps } from '../types'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'

import {
  getTokenColor,
  getTokenColorWithOpacity,
  setOpacity,
} from '../../../screens/home/tokenColor'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
import balances from '../../../screens/home/tempBalances.json'
import { ITokenWithBalance } from '../../../lib/rifWalletServices/RIFWalletServicesTypes'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const [selected] = useState<ITokenWithBalance>(
    balances[0] as ITokenWithBalance,
  )

  const selectedTokenColor = getTokenColor(selected.symbol)

  const containerStyles = {
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }
  const selectedToken = 'TRBTC'

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <Text style={styles.header}>Master Key</Text>
      <LinearGradient
        colors={['#FFFFFF', '#E1E1E1']}
        style={{ ...styles.topContainer, ...containerStyles }}>
        <ScrollView style={styles.portfolio}>
          <TouchableOpacity>
            <CopyComponent testID={'mnemonic'} value={mnemonic} />
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      <View style={styles.centerRow}>
        <SquareButton
          // @ts-ignore
          onPress={() => navigation.navigate('ImportMasterKey', { mnemonic })}
          title="Continue"
          testID="Address.CopyButton"
          icon={<Arrow color={getTokenColor(selectedToken)} rotate={90} />}
        />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    height: '100%',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  secHeader: {
    fontSize: 18,
    textAlign: 'center',
  },

  portfolio: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    borderRadius: 25,
    padding: 30,
  },
  topContainer: {
    marginTop: 60,
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
    // shadowRadius: 10,
    elevation: 2,
  },
})
