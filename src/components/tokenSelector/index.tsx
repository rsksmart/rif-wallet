import React from 'react'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { TokenButton } from '../button/TokenButton'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { balanceToString } from '../../screens/balances/BalancesScreen'
import { TokenImage } from '../../screens/home/TokenImage'
import { getTokenColor } from '../../screens/home/tokenColor'
import { colors } from '../../styles/colors'

interface Interface {
  availableTokens: ITokenWithBalance[]
  onTokenSelection: (token: ITokenWithBalance) => void
  showSelector: boolean
  onModalClosed: any
  animateModal: boolean
  onAnimateModal: any
}

const TokenSelector: React.FC<Interface> = ({
  availableTokens,
  onTokenSelection,
  showSelector,
  onModalClosed,
  animateModal,
  onAnimateModal,
}) => {
  return (
    <SwipeUpDownModal
      modalVisible={showSelector}
      PressToanimate={animateModal}
      //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
      ContentModal={
        <View style={styles.containerContent}>
          <ScrollView>
            {availableTokens.map((token: ITokenWithBalance) => {
              const balance = balanceToString(token.balance, token.decimals)
              return (
                <View key={token.symbol}>
                  <TokenButton
                    onPress={() => onTokenSelection(token)}
                    title={token.symbol}
                    balance={balance}
                    icon={<TokenImage symbol={token.symbol} />}
                    style={{ backgroundColor: getTokenColor(token.symbol) }}
                  />
                </View>
              )
            })}
          </ScrollView>
        </View>
      }
      HeaderStyle={styles.headerContent}
      ContentModalStyle={styles.Modal}
      HeaderContent={
        <View style={styles.containerHeader}>
          <View style={styles.handlerContainer}>
            <View style={styles.handler} />
          </View>
          <View style={styles.actionsContainer}>
            <View>
              <Text style={styles.action}>select asset</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  onAnimateModal(true)
                }}>
                <Text style={styles.action}>hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
      onClose={() => {
        onModalClosed()
      }}
    />
  )
}

export default TokenSelector

const styles = StyleSheet.create({
  containerContent: { marginRight: 40, marginLeft: 40 },
  containerHeader: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,

    height: 60,
    backgroundColor: colors.darkBlue,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handlerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  handler: {
    height: 2,
    borderRadius: 5,
    backgroundColor: colors.white,
    width: 50,
    marginTop: 10,
  },
  action: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  swapper: {
    borderColor: colors.darkBlue,
    borderTopColor: colors.white,

    borderWidth: 2,
  },
  headerContent: {
    marginTop: 160,
  },
  Modal: {
    backgroundColor: colors.darkBlue,
    marginTop: 220,
  },
})
