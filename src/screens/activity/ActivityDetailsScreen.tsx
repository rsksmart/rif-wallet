import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import { IApiTransaction } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IEnhancedResult } from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: IEnhancedResult
}

export type ActivityDetailsScreenProps = {}

export const ActivityDetailsScreen: React.FC<
  ScreenWithWallet & ActivityDetailsScreenProps
> = ({}) => {
  return (
    <ScrollView>
      <Text>Activity Details</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  activityRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  transactionDetailsTitle: {
    fontSize: 20,
    marginBottom: 10,
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
  },
})
