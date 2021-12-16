import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { BigNumber } from 'ethers'

import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { shortAddress } from '../../lib/utils'
import { IActivityTransaction } from './ActivityScreen'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Address } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { grid } from '../../styles/grid'
import { TokenImage } from '../home/TokenImage'

const RBTC_DECIMALS = 18

interface Interface {
  activityTransaction: IActivityTransaction
  navigation: any //@todo
}

const ActivityRow: React.FC<Interface> = ({
  activityTransaction,
  navigation,
}) => {
  const handleClick = () =>
    navigation.navigate('ActivityDetails', activityTransaction)

  return (
    <View
      key={activityTransaction.originTransaction.hash}
      testID={`${activityTransaction.originTransaction.hash}.View`}>
      <TouchableOpacity
        onPress={handleClick}
        testID={`${activityTransaction.originTransaction.hash}.Button`}
        style={{ ...grid.row, ...styles.activityRow }}>
        <View style={grid.column2}>
          <View style={styles.icon}>
            <TokenImage
              symbol={activityTransaction.enhancedTransaction?.symbol}
              width={30}
              height={30}
            />
          </View>
        </View>
        <View style={grid.column6}>
          <Text style={styles.text}>
            To: {shortAddress(activityTransaction.originTransaction.to)}
          </Text>
        </View>
        <View style={grid.column4}>
          {activityTransaction.enhancedTransaction ? (
            <Text
              style={
                styles.value
              }>{`${activityTransaction.enhancedTransaction.value} ${activityTransaction.enhancedTransaction?.symbol}`}</Text>
          ) : (
            <Text style={styles.value}>
              {`${formatBigNumber(
                BigNumber.from(activityTransaction.originTransaction.value),
                RBTC_DECIMALS,
              )} rBTC`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  activityRow: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 15,
  },
  text: {
    paddingTop: 10,
    color: '#66777E',
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  value: {
    paddingTop: 10,
    textAlign: 'right',
    color: '#66777E',
  },
})

export default ActivityRow
