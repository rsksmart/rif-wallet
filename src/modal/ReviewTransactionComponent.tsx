import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Header2, Paragraph } from '../components/typography'
import Button from '../components/button'
import { ReviewTransactionDataI } from './ModalComponent'

export interface TransactionPartial {
  to: string
  from: string
  value: number
  data?: string
  gasLimit?: number | string // string for easier editing below
  gasPrice?: number | string
}

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: {
    name: string
    key: string
    params: {
      transaction: TransactionPartial
      onConfirm: (data: ReviewTransactionDataI) => void
    }
  }
}

const ReviewTransactionComponent: React.FC<Interface> = ({
  navigation,
  route,
}) => {
  const { transaction, onConfirm } = route.params
  const [updateTransaction, setUpdateTransaction] =
    useState<TransactionPartial>({
      ...transaction,
      gasLimit: '10000',
      gasPrice: '0.068',
    })

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // do something
      console.log('beforeRemove...')
    })

    return unsubscribe
  }, [navigation])

  // gasLimit can be a number or empty (temporarly)
  const changeGasLimit = (gasLimit: string) => {
    if (parseInt(gasLimit, 10).toString() === gasLimit || gasLimit === '') {
      setUpdateTransaction({
        ...updateTransaction,
        gasLimit: gasLimit,
      })
    }
  }

  // gasPrice is an integer that temporarly can end with 0 or a dot
  const changeGasPrice = (gasPrice: string) => {
    if (gasPrice.match(/^(\d*)([,.]\d{0,})?$/)) {
      setUpdateTransaction({
        ...updateTransaction,
        gasPrice: gasPrice,
      })
    }
  }

  const handleConfirm = (newTransaction: TransactionPartial) => {
    // @jesse - todo confirm integer/float values
    navigation.goBack()
    
  }

  return (
    <View style={styles.view}>
      <Header2>Review Transaction</Header2>
      <Paragraph>to: {transaction.to}</Paragraph>
      <Paragraph>from: {transaction.from}</Paragraph>
      <Paragraph>value: {transaction.value}</Paragraph>

      <Paragraph>gas limit:</Paragraph>
      <TextInput
        value={updateTransaction.gasLimit?.toString()}
        style={styles.textInput}
        onChangeText={changeGasLimit}
        keyboardType="number-pad"
      />

      <Paragraph>gas price:</Paragraph>
      <TextInput
        value={updateTransaction.gasPrice?.toString()}
        style={styles.textInput || ''}
        onChangeText={changeGasPrice}
        keyboardType="number-pad"
      />
      {transaction.data && <Paragraph>{transaction.data}</Paragraph>}
      <Button
        onPress={() => handleConfirm(updateTransaction)}
        title="Confirm"
      />
      <Button onPress={() => handleConfirm(null)} title="Cancel" />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    padding: 15,
  },
  textInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#919191',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
})

export default ReviewTransactionComponent
