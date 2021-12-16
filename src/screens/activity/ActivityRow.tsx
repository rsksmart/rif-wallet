import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { BigNumber } from 'ethers'

import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { shortAddress } from '../../lib/utils'
import { IActivityTransaction } from './ActivityScreen'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Address } from '../../components'

const RBTC_DECIMALS = 18

interface Interface {
  activityTransaction: IActivityTransaction
  navigation: any //@todo
}

const ActivityRow: React.FC<Interface> = ({
  activityTransaction,
  navigation,
}) => {
  return (
    <View
      key={activityTransaction.originTransaction.hash}
      style={styles.activityRow}
      testID={`${activityTransaction.originTransaction.hash}.View`}>
      <View style={styles.activitySummary}>
        <Text>
          {activityTransaction.enhancedTransaction ? (
            <>
              <Text
                testID={`${activityTransaction.originTransaction.hash}.Text`}>
                {`${activityTransaction.enhancedTransaction.value} ${activityTransaction.enhancedTransaction.symbol} sent To `}
              </Text>
              <Address>{activityTransaction.enhancedTransaction.to}</Address>
            </>
          ) : (
            <>
              {formatBigNumber(
                BigNumber.from(activityTransaction.originTransaction.value),
                RBTC_DECIMALS,
              )}
              {' RBTC'}
              {shortAddress(activityTransaction.originTransaction.to)}{' '}
            </>
          )}
        </Text>
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => {
            navigation.navigate('ActivityDetails', activityTransaction)
          }}
          title={'>'}
          testID={`${activityTransaction.originTransaction.hash}.Button`}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  activityRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  activitySummary: {
    position: 'absolute',
    left: 0,
  },
  button: {
    position: 'absolute',
    right: 0,
  },
  refreshButtonView: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

export default ActivityRow
