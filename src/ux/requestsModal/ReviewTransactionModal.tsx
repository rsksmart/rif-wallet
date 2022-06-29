import React, { useMemo, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { BigNumber } from 'ethers'

import { SendTransactionRequest } from 'rif-wallet/packages/core'

import { sharedStyles } from './sharedStyles'
import { Button, Header2, Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import useEnhancedWithGas from './useEnhancedWithGas'

interface Interface {
  request: SendTransactionRequest
  closeModal: () => void
}

const ReviewTransactionModal: React.FC<ScreenWithWallet & Interface> = ({
  request,
  closeModal,
  wallet,
}) => {
  const txRequest = useMemo(() => request.payload[0], [request])
  const { enhancedTransactionRequest, isLoaded, setGasLimit, setGasPrice } =
    useEnhancedWithGas(wallet, txRequest)

  const [error, setError] = useState<Error | null>(null)

  // convert from string to Transaction and pass out of component
  const confirmTransaction = async () => {
    try {
      await request.confirm({
        gasPrice: BigNumber.from(enhancedTransactionRequest.gasPrice),
        gasLimit: BigNumber.from(enhancedTransactionRequest.gasLimit),
      })
      closeModal()
    } catch (err: any) {
      setError(err)
    }
  }

  const cancelTransaction = () => {
    request.reject('User rejects the transaction')
    closeModal()
  }

  return isLoaded ? (
    <View>
      <Header2>Review Transaction</Header2>
      {enhancedTransactionRequest && (
        <View testID="TX_VIEW">
          <Paragraph>to: {enhancedTransactionRequest.to}</Paragraph>
          <Paragraph>from: {enhancedTransactionRequest.from}</Paragraph>
          {enhancedTransactionRequest.value && (
            <Paragraph>value: {enhancedTransactionRequest.value}</Paragraph>
          )}
          {enhancedTransactionRequest.symbol && (
            <Paragraph>token: {enhancedTransactionRequest.symbol}</Paragraph>
          )}
          {enhancedTransactionRequest.balance && (
            <Paragraph>
              current balance: {enhancedTransactionRequest.balance}
            </Paragraph>
          )}
          <View
            style={
              enhancedTransactionRequest.functionName
                ? styles.boxStyle
                : undefined
            }>
            {enhancedTransactionRequest.functionName && (
              <>
                <Paragraph>contract interaction</Paragraph>
                <Paragraph>
                  function: {enhancedTransactionRequest.functionName}
                </Paragraph>
              </>
            )}
            {enhancedTransactionRequest.functionParameters &&
              enhancedTransactionRequest.functionParameters.map(
                ({ name, value }: any) => (
                  <Paragraph>
                    {name}: {value.toString()}
                  </Paragraph>
                ),
              )}
          </View>
        </View>
      )}

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Paragraph>gas limit:</Paragraph>
        </View>
        <View style={sharedStyles.column}>
          <TextInput
            value={enhancedTransactionRequest.gasLimit}
            style={sharedStyles.textInput}
            onChangeText={setGasLimit}
            keyboardType="number-pad"
            placeholder="gas limit"
            testID="gasLimit.TextInput"
          />
        </View>
      </View>
      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Paragraph>gas price:</Paragraph>
        </View>
        <View style={sharedStyles.column}>
          <TextInput
            value={enhancedTransactionRequest.gasPrice}
            style={sharedStyles.textInput || ''}
            onChangeText={setGasPrice}
            keyboardType="number-pad"
            placeholder="gas price"
            testID="gasPrice.TextInput"
          />
        </View>
      </View>

      {error && (
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Paragraph>Error:</Paragraph>
          </View>
          <View style={sharedStyles.column}>
            <Paragraph>{error.message}</Paragraph>
          </View>
        </View>
      )}

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Button
            title="Confirm"
            onPress={confirmTransaction}
            testID="Confirm.Button"
            disabled={!isLoaded}
          />
        </View>
        <View style={sharedStyles.column}>
          <Button
            title="Cancel"
            onPress={cancelTransaction}
            testID="Cancel.Button"
            disabled={!isLoaded}
          />
        </View>
      </View>

      {!!enhancedTransactionRequest?.data && (
        <>
          <View style={styles.lineStyle} />
          <View style={sharedStyles.row}>
            <Paragraph>data: {enhancedTransactionRequest.data}</Paragraph>
          </View>
        </>
      )}
    </View>
  ) : (
    <Paragraph>loading...</Paragraph>
  )
}

export default ReviewTransactionModal

const styles = StyleSheet.create({
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    marginTop: 40,
  },
  boxStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    padding: 5,
  },
})
