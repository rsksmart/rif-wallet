import { toChecksumAddress } from '@rsksmart/rsk-utils'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'

import { AddressInputSelector } from 'components/address/AddressInputSelector'
import { TransferButton } from 'components/button/TransferButton'
import { RegularText, Tabs } from 'components/index'
import { colors, grid } from 'src/styles'
import { IActivityTransaction, IPrice } from 'src/subscriptions/types'

import { AssetChooser } from './AssetChooser'
import { RecentTransactions } from './RecentTransactions'
import { SetAmountHOCComponent } from './SetAmountHOCComponent'
import { MixedTokenAndNetworkType } from './types'
import { useTokenSelectedTabs } from './useTokenSelectedTabs'

interface Props {
  onConfirm: (
    selectedToken: MixedTokenAndNetworkType,
    amount: string,
    to: string,
  ) => void
  tokenList: MixedTokenAndNetworkType[]
  tokenPrices: Record<string, IPrice>
  chainId: number
  initialValues: {
    asset?: MixedTokenAndNetworkType
    amount?: string
    recipient?: string
  }
  transactions: IActivityTransaction[]
  onTokenSelected?: (tokenSelected: MixedTokenAndNetworkType) => void
}

interface FormValues {
  amount: string
  to: string
  isToValid: boolean
  isAmountValid: boolean
}

export const TransactionForm = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  transactions,
  onConfirm,
  onTokenSelected,
}: Props) => {
  const { t } = useTranslation()
  const methods = useForm<FormValues>({
    defaultValues: {
      amount: initialValues.amount || '0',
      to: initialValues.recipient || '',
      isAmountValid: false,
      isToValid: false,
    },
  })
  const { getValues, setValue, handleSubmit, resetField } = methods
  const [selectedToken, setSelectedToken] = useState<MixedTokenAndNetworkType>(
    initialValues.asset || tokenList[0],
  )

  const [activeTab, setActiveTab] = useState('address')
  const { tabs } = useTokenSelectedTabs(selectedToken, setActiveTab)

  const [error, setError] = useState<string | null>(null)

  const isValidTransaction =
    getValues('isAmountValid') && getValues('isToValid')

  const tokenQuote = selectedToken.contractAddress.startsWith('BITCOIN')
    ? tokenPrices.BTC.price
    : tokenPrices[selectedToken.contractAddress]?.price

  const handleAmountChange = useCallback(
    (newAmount: string, isValid: boolean) => {
      setError(null)
      setValue('amount', newAmount)
      setValue('isAmountValid', isValid)
    },
    [setValue],
  )

  const handleTargetAddressChange = useCallback(
    (address: string, isValid: boolean) => {
      setError(null)
      setValue('to', address)
      setValue('isToValid', isValid)
    },
    [setValue],
  )

  const handleSelectRecentAddress = useCallback(
    (address: string) => {
      handleTargetAddressChange(toChecksumAddress(address, chainId), true)
      setActiveTab('address')
    },
    [chainId, handleTargetAddressChange],
  )

  const handleConfirmClick = useCallback(
    (values: FormValues) => onConfirm(selectedToken, values.amount, values.to),
    [selectedToken, onConfirm],
  )

  const onTokenSelect = useCallback(
    (token: MixedTokenAndNetworkType) => {
      setSelectedToken(oldToken => {
        // Reset address when token type is changed
        if ('isBitcoin' in oldToken === !('isBitcoin' in token)) {
          handleTargetAddressChange('', false)
        }
        return token
      })
      if (onTokenSelected) {
        onTokenSelected(token)
      }
    },
    [onTokenSelected, handleTargetAddressChange],
  )

  return (
    <View>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <RegularText style={styles.label}>asset</RegularText>
          <AssetChooser
            selectedAsset={selectedToken}
            assetList={tokenList}
            onAssetSelected={onTokenSelect}
          />
        </View>
      </View>
      <View style={[grid.row, styles.section]}>
        <View style={grid.column12}>
          <SetAmountHOCComponent
            setAmount={handleAmountChange}
            token={selectedToken}
            usdAmount={tokenQuote}
          />
        </View>
      </View>
      <View>
        <Tabs
          title={'recipient'}
          tabs={tabs}
          selectedTab={activeTab}
          onTabSelected={setActiveTab}
        />
        {activeTab === 'address' && (
          <>
            <FormProvider {...methods}>
              <AddressInputSelector
                label={t('address_rns_placeholder')}
                placeholder={t('address_rns_placeholder')}
                initialValue={getValues('to')}
                inputName={'to'}
                onChangeAddress={handleTargetAddressChange}
                resetValue={() => {
                  resetField('to')
                  resetField('isToValid')
                }}
                testID={'To.Input'}
                chainId={chainId}
                token={selectedToken}
              />
            </FormProvider>
            <View>
              <RegularText>{error}</RegularText>
            </View>

            <View style={styles.centerRow}>
              <TransferButton
                style={styles.button}
                onPress={handleSubmit(handleConfirmClick)}
                disabled={!isValidTransaction}
                accessibilityLabel={'transfer'}
              />
            </View>
          </>
        )}
        {activeTab === 'recent' && (
          <>
            <RecentTransactions
              transactions={transactions}
              onSelect={handleSelectRecentAddress}
            />
            <View>
              <RegularText>{error}</RegularText>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: colors.white,
    padding: 10,
  },
  section: {
    marginBottom: 30,
  },
  chooseAsset: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRow: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 14,
    paddingLeft: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },
})
