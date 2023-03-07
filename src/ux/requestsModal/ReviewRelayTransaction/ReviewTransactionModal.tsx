import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { BigNumber } from 'ethers'

import { balanceToDisplay, shortAddress } from 'lib/utils'

import { PrimaryButton, RegularText, SecondaryButton } from 'components/index'
import { sharedStyles } from 'shared/styles'
import { colors } from 'src/styles/colors'
import { grid } from 'src/styles'

import ReadOnlyField from './../ReadOnlyField'
import { EnhancedTransactionRequest } from '../useEnhancedWithGas'

interface Props {
  enhancedTransactionRequest: EnhancedTransactionRequest
  txCostInRif: BigNumber
  confirmTransaction: () => void
  cancelTransaction: () => void
}

const ReviewTransactionModal = ({
  enhancedTransactionRequest,
  txCostInRif,
  confirmTransaction,
  cancelTransaction,
}: Props) => {
  const { t } = useTranslation()

  const feeEstimateReady = txCostInRif.toString() !== '0'
  const rifFee = feeEstimateReady
    ? `${balanceToDisplay(txCostInRif, 18, 0)} tRIF`
    : 'estimating fee...'

  return (
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

      <ReadOnlyField label="Fee in tRIF" value={rifFee} testID="tRIF.fee" />

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SecondaryButton
            onPress={cancelTransaction}
            title={t('reject')}
            testID="Cancel.Button"
            accessibilityLabel="cancel"
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
            onPress={confirmTransaction}
            title={t('sign')}
            testID="Confirm.Button"
            accessibilityLabel="confirm"
            disabled={!feeEstimateReady}
          />
        </View>
      </View>
    </ScrollView>
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
