import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { BigNumber } from 'ethers'

import { SendTransactionRequest } from '../../lib/core/RIFWallet'

import { sharedStyles } from './sharedStyles'
import { CustomInput, Loading, ModalHeader, Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import useEnhancedWithGas from './useEnhancedWithGas'
import { setOpacity } from '../../screens/home/tokenColor'
import { SquareButton } from '../../components/button/SquareButton'
import { CancelIcon } from '../../components/icons/CancelIcon'
import { SignIcon } from '../../components/icons/SignIcon'
import { useTranslation } from 'react-i18next'
import { shortAddress } from '../../lib/utils'

interface Interface {
  request: SendTransactionRequest
  closeModal: () => void
}

const ReviewTransactionModal: React.FC<ScreenWithWallet & Interface> = ({
  request,
  closeModal,
  wallet,
}) => {
  const { t } = useTranslation()

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
    <ScrollView>
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>review transaction</ModalHeader>

        {enhancedTransactionRequest && (
          <View
            testID="TX_VIEW"
            style={[sharedStyles.rowInColumn, styles.topBox]}>
            <View style={[sharedStyles.rowInColumn, styles.marginBottom]}>
              {enhancedTransactionRequest.balance && (
                <View style={styles.dataRow}>
                  <Text style={[styles.paragraphLabel, styles.inputLabel]}>
                    current balance:
                  </Text>
                  <Text style={styles.paragraphValue}>
                    {enhancedTransactionRequest.balance}
                  </Text>
                </View>
              )}
            </View>
            <View style={[sharedStyles.rowInColumn, styles.marginBottom]}>
              <Text style={[styles.paragraphLabel, styles.inputLabel]}>
                value
              </Text>
              <View style={[styles.message, styles.value]} testID="Data.View">
                {enhancedTransactionRequest.value && (
                  <Text>{enhancedTransactionRequest.value}</Text>
                )}
                {enhancedTransactionRequest.symbol && (
                  <Text>{enhancedTransactionRequest.symbol}</Text>
                )}
              </View>
            </View>
            <View style={sharedStyles.row}>
              <View style={sharedStyles.column}>
                <Text style={[styles.paragraphLabel, styles.inputLabel]}>
                  from
                </Text>
                <View style={styles.message} testID="Data.View">
                  <Text>{shortAddress(enhancedTransactionRequest.from)}</Text>
                </View>
              </View>
              <View style={sharedStyles.column}>
                <Text style={[styles.paragraphLabel, styles.inputLabel]}>
                  to
                </Text>
                <View style={styles.message} testID="Data.View">
                  <Text>{shortAddress(enhancedTransactionRequest.to)}</Text>
                </View>
              </View>
            </View>

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
      </View>

      <View style={styles.advanceSection}>
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Text style={[styles.paragraphLabel, styles.inputLabel]}>
              gas limit
            </Text>
            <CustomInput
              value={enhancedTransactionRequest.gasLimit}
              onChange={setGasLimit}
              keyboardType="number-pad"
              placeholder="gas limit"
              testID="gasLimit.TextInput"
            />
          </View>
          <View style={sharedStyles.column}>
            <Text style={[styles.paragraphLabel, styles.inputLabel]}>
              gas price
            </Text>
            <CustomInput
              value={enhancedTransactionRequest.gasPrice}
              onChange={setGasPrice}
              keyboardType="number-pad"
              placeholder="gas price"
              testID="gasPrice.TextInput"
            />
          </View>
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

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SquareButton
            onPress={cancelTransaction}
            title={t('reject')}
            icon={<CancelIcon color={'#ffb4b4'} />}
            shadowColor="#313c3c"
            backgroundColor={'#313c3c'}
            testID="Cancel.Button"
            disabled={!isLoaded}
          />
        </View>
        <View style={sharedStyles.column}>
          <SquareButton
            onPress={confirmTransaction}
            title={t('sign')}
            testID="Confirm.Button"
            icon={<SignIcon color={'#91ffd9'} />}
            shadowColor="#313c3c"
            backgroundColor={'#313c3c'}
            disabled={!isLoaded}
          />
        </View>
      </View>
    </ScrollView>
  ) : (
    <View style={styles.loadingContent}>
      <Loading />
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
  dataRow: {
    flexDirection: 'row',
  },
  paragraphLabel: {
    fontSize: 14,
    color: setOpacity('#373f48', 0.6),
    fontWeight: 'bold',
    marginRight: 5,
  },
  paragraphValue: {
    fontSize: 14,
    color: setOpacity('#373f48', 0.6),
  },
  topBox: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  advanceSection: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
  inputLabel: {
    marginLeft: 10,
  },
  message: {
    padding: 10,
    marginTop: 0,
    marginBottom: 10,

    borderRadius: 14,
    backgroundColor: setOpacity('#313c3c', 0.1),
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,

    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.24,
    color: '#373f48',
    alignItems: 'center',
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  marginBottom: {
    marginBottom: 20,
  },
  loadingContent: {
    padding: 20,
  },
})
