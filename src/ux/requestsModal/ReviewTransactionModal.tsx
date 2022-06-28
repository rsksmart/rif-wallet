import React, { useMemo, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardTypeOptions,
} from 'react-native'
import { BigNumber } from 'ethers'
import { RegularText } from '../../components/typography'

import { SendTransactionRequest } from '../../lib/core'

import { sharedStyles } from './sharedStyles'
import { CustomInput, Loading, Paragraph } from '../../components'
import { ScreenWithWallet } from '../../screens/types'
import useEnhancedWithGas from './useEnhancedWithGas'
import { useTranslation } from 'react-i18next'
import { shortAddress } from '../../lib/utils'
import { BlueButton } from '../../components/button/ButtonVariations'

interface Interface {
  request: SendTransactionRequest
  closeModal: () => void
}

type IRealOnlyField = {
  label: string
  value: string
  testID: string
}

const ReadOnlyField: React.FC<IRealOnlyField> = ({ label, value, testID }) => {
  return (
    <>
      <View>
        <RegularText style={styles.label}>{label}</RegularText>
      </View>
      <View>
        <View style={styles.inputText} testID={testID}>
          <Text>{value}</Text>
        </View>
      </View>
    </>
  )
}

type IInputField = {
  label: string
  value: string
  keyboardType: KeyboardTypeOptions
  placeholder: string
  testID: string
  handleValueOnChange: any
}
const InputField: React.FC<IInputField> = ({
  label,
  value,
  keyboardType,
  placeholder,
  testID,
  handleValueOnChange,
}) => {
  return (
    <>
      <View>
        <RegularText style={styles.label}>{label}</RegularText>
      </View>
      <View>
        <CustomInput
          value={value}
          onChange={handleValueOnChange}
          keyboardType={keyboardType}
          placeholder={placeholder}
          testID={testID}
        />
      </View>
    </>
  )
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
    } catch (err) {
      setError(err)
    }
  }

  const cancelTransaction = () => {
    request.reject('User rejects the transaction')
    closeModal()
  }

  return isLoaded ? (
    <ScrollView>
      <View>
        {enhancedTransactionRequest && (
          <View
            testID="TX_VIEW"
            style={[sharedStyles.rowInColumn, styles.topBox]}>
            <ReadOnlyField
              label={'amount'}
              value={enhancedTransactionRequest.value}
              testID={'Data.View'}
            />

            <ReadOnlyField
              label={'asset'}
              value={enhancedTransactionRequest.symbol}
              testID={''}
            />

            <ReadOnlyField
              label={'from'}
              value={shortAddress(enhancedTransactionRequest.from)}
              testID={'Data.View'}
            />

            <ReadOnlyField
              label={'to'}
              value={shortAddress(enhancedTransactionRequest.to)}
              testID={'Data.View'}
            />

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

      <InputField
        label={'gas limit'}
        value={enhancedTransactionRequest.gasLimit}
        keyboardType="number-pad"
        placeholder="gas limit"
        testID={'gasLimit.TextInput'}
        handleValueOnChange={setGasLimit}
      />

      <InputField
        label={'gas price'}
        value={enhancedTransactionRequest.gasPrice}
        keyboardType="number-pad"
        placeholder="gas price"
        testID={'gasPrice.TextInput'}
        handleValueOnChange={setGasPrice}
      />

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
          <BlueButton
            onPress={cancelTransaction}
            title={t('reject')}
            testID="Cancel.Button"
            disabled={!isLoaded}
          />
        </View>
        <View style={sharedStyles.column}>
          <BlueButton
            onPress={confirmTransaction}
            title={t('sign')}
            testID="Confirm.Button"
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
    color: 'rgba(55, 63, 72, 0.6)',
    fontWeight: 'bold',
    marginRight: 5,
  },
  paragraphValue: {
    fontSize: 14,
    color: 'rgba(55, 63, 72, 0.6)',
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
  label: {
    margin: 5,
  },
  inputText: {
    padding: 15,
    marginTop: 0,
    marginBottom: 10,

    borderRadius: 10,
    backgroundColor: 'rgba(49, 60, 60, 0.1)',
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
