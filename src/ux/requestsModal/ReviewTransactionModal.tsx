import { BigNumber } from 'ethers'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SendTransactionRequest } from '../../lib/core'

import { useTranslation } from 'react-i18next'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { Loading, Paragraph, RegularText } from '../../components'
import { shortAddress } from '../../lib/utils'
import { ScreenWithWallet } from '../../screens/types'
import { sharedStyles } from '../../shared/styles'
import { colors } from '../../styles'
import InputField from './InpuField'
import ReadOnlyField from './ReadOnlyField'
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
      <View>
        {enhancedTransactionRequest && (
          <View testID="TX_VIEW" style={[sharedStyles.rowInColumn]}>
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
                  <RegularText style={styles.label}>
                    contract interaction
                  </RegularText>

                  <ReadOnlyField
                    label={'function'}
                    value={enhancedTransactionRequest.functionName}
                    testID={'Data.View'}
                  />
                </>
              )}
              {enhancedTransactionRequest.functionParameters &&
                enhancedTransactionRequest.functionParameters.map(
                  ({ name, value }: any) => (
                    <ReadOnlyField
                      key={name}
                      label={name}
                      value={value.toString()}
                      testID={'Data.View'}
                    />
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
          <SecondaryButton
            onPress={cancelTransaction}
            title={t('reject')}
            testID="Cancel.Button"
            disabled={!isLoaded}
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
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
  label: {
    margin: 5,
  },
  boxStyle: {
    borderWidth: 0.5,
    borderColor: colors.darkGray,
    padding: 10,
    paddingBottom: 5,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 5,
  },

  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
  loadingContent: {
    padding: 20,
  },
})
