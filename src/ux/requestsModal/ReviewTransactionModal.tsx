import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { RIF_TOKEN_ADDRESS_TESTNET } from '@rsksmart/rif-relay-light-sdk'

import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from 'lib/core'
import { balanceToDisplay, shortAddress } from 'lib/utils'

import {
  Loading,
  PrimaryButton,
  RegularText,
  SecondaryButton,
} from 'components/index'
import { ScreenWithWallet } from 'screens/types'
import { sharedStyles } from 'shared/styles'
import { errorHandler } from 'shared/utils'
import { colors, grid } from '../../styles'
import ReadOnlyField from './ReadOnlyField'
import useEnhancedWithGas from './useEnhancedWithGas'

interface Props {
  request: SendTransactionRequest
  closeModal: () => void
}

const ReviewTransactionModal = ({
  request,
  closeModal,
  wallet,
}: ScreenWithWallet & Props) => {
  const { t } = useTranslation()

  const txRequest = useMemo(() => request.payload[0], [request])
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
  )

  const [error, setError] = useState<string | null>(null)
  const [txCostInRif, setTxCostInRif] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    wallet.rifRelaySdk.estimateTransactionCost().then(setTxCostInRif)
  }, [wallet.rifRelaySdk])

  const confirmTransaction = async () => {
    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(enhancedTransactionRequest.gasPrice),
      gasLimit: BigNumber.from(enhancedTransactionRequest.gasLimit),
      tokenPayment: {
        tokenContract: RIF_TOKEN_ADDRESS_TESTNET,
        tokenAmount: txCostInRif,
      },
    }

    try {
      await request.confirm(confirmObject)
      closeModal()
    } catch (err) {
      setError(errorHandler(err))
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
            {enhancedTransactionRequest.value && (
              <ReadOnlyField
                label={'amount'}
                value={enhancedTransactionRequest.value.toString()}
                testID={'Data.View'}
              />
            )}

            {enhancedTransactionRequest.symbol && (
              <ReadOnlyField
                label={'asset'}
                value={enhancedTransactionRequest.symbol}
                testID={''}
              />
            )}

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
            </View>
          </View>
        )}
      </View>

      {txCostInRif && (
        <ReadOnlyField
          label="Fee in tRIF"
          value={`${balanceToDisplay(txCostInRif, 18, 0)} tRIF`}
          testID="tRIF.fee"
        />
      )}

      {error && (
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <RegularText>Error:</RegularText>
          </View>
          <View style={sharedStyles.column}>
            <RegularText>{error}</RegularText>
          </View>
        </View>
      )}

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SecondaryButton
            onPress={cancelTransaction}
            title={t('reject')}
            testID="Cancel.Button"
            accessibilityLabel="cancel"
            disabled={!isLoaded}
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
            onPress={confirmTransaction}
            title={t('sign')}
            testID="Confirm.Button"
            accessibilityLabel="confirm"
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
  toggleContainer: {
    ...grid.column5,
    marginTop: 25,
    marginLeft: 15,
  },
})
