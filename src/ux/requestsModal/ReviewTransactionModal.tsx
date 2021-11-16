import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { BigNumber } from 'ethers'

import { SendTransactionRequest } from '../../lib/core/RIFWallet'

import { sharedStyles } from './sharedStyles'
import { Button, Header2, Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import { AbiEnhancer, IEnhancedResult } from '../../lib/abiEnhancer/AbiEnhancer'

/**
 * Used for UI only to make editing transactions easier. Allows for
 * gasPrice to be '0.', '0.0', or blank, as the user types it in.
 */

interface Interface {
  request: SendTransactionRequest
  closeModal: () => void
}

// string object helpers
const convertValueToString = (value?: any) => (value ? value.toString() : '')
const convertNumberToString = (value?: any) => (value ? value.toString() : '0')

const convertTransactionToStrings = (tx: IEnhancedResult) => ({
  ...tx,
  to: convertValueToString(tx.to),
  from: convertValueToString(tx.from),
  data: convertValueToString(tx.data),
  gasLimit: convertNumberToString(tx.gasLimit),
  gasPrice: convertNumberToString(tx.gasPrice),
})

const abiEnhancer = new AbiEnhancer()

const ReviewTransactionModal: React.FC<ScreenWithWallet & Interface> = ({
  request,
  closeModal,
  wallet,
}) => {
  const [enhancedTransactionRequest, setEnhancedTransactionRequest] = useState<
    any | null
  >(null)

  const txRequest = useMemo(() => request.payload[0], [request])

  const [gasPrice, setGasPrice] = useState(
    convertNumberToString(txRequest.gasPrice),
  )
  const [gasLimit, setGasLimit] = useState(
    convertNumberToString(txRequest.gasLimit),
  )
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!txRequest.gasLimit) {
      wallet.smartWallet
        .estimateDirectExecute(txRequest.to || '0x', txRequest.data || '0x')
        .then((gl: BigNumber) => setGasLimit(gl.toString()))
        .catch(() => setGasLimit('0'))
    }

    if (!txRequest.gasPrice) {
      wallet.provider
        ?.getGasPrice()
        .then((gp: BigNumber) =>
          setGasPrice(gp.mul('101').div('100').toString()),
        )
    }
  }, [txRequest])

  useEffect(() => {
    abiEnhancer.enhance(wallet, txRequest).then(enhanced => {
      const enhancedToStrings = convertTransactionToStrings(
        enhanced ?? txRequest,
      )

      setEnhancedTransactionRequest(enhancedToStrings)
    })
  }, [wallet, txRequest])

  // convert from string to Transaction and pass out of component
  const confirmTransaction = async () => {
    try {
      await request.confirm({
        gasPrice: BigNumber.from(gasPrice),
        gasLimit: BigNumber.from(gasLimit),
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

  return (
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

      {!enhancedTransactionRequest && <Paragraph>loading...</Paragraph>}

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Paragraph>gas limit:</Paragraph>
        </View>
        <View style={sharedStyles.column}>
          <TextInput
            value={gasLimit}
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
            value={gasPrice}
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
            disabled={enhancedTransactionRequest === null}
          />
        </View>
        <View style={sharedStyles.column}>
          <Button
            title="Cancel"
            onPress={cancelTransaction}
            testID="Cancel.Button"
            disabled={enhancedTransactionRequest === null}
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
