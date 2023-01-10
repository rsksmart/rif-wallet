import { toChecksumAddress } from '@rsksmart/rsk-utils'
import { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Tabs } from 'src/components'
import { AddressInputSelector } from 'components/address/AddressInputSelector'
import { TransferButton } from 'components/button/TransferButton'
import { colors, grid } from 'src/styles'
import { IActivityTransaction, IPrice } from 'src/subscriptions/types'

import { AssetChooser } from './AssetChooser'
import { RecentTransactions } from './RecentTransactions'
import { SetAmountHOCComponent } from './SetAmountHOCComponent'
import { MixedTokenAndNetworkType } from './types'
import { useTokenSelectedTabs } from './useTokenSelectedTabs'

interface Interface {
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

interface txDetail {
  value: string
  isValid: boolean
}

export const TransactionForm: React.FC<Interface> = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  transactions,
  onConfirm,
  onTokenSelected,
}) => {
  const [selectedToken, setSelectedToken] = useState<MixedTokenAndNetworkType>(
    initialValues.asset || tokenList[0],
  )

  const [activeTab, setActiveTab] = useState('address')
  const { tabs } = useTokenSelectedTabs(selectedToken, setActiveTab)

  const [amount, setAmount] = useState<txDetail>({
    value: initialValues.amount || '0',
    isValid: false,
  })

  const [to, setTo] = useState<txDetail>({
    value: initialValues.recipient || '',
    isValid: false,
  })

  const [error, setError] = useState<string | null>(null)

  const isValidTransaction = amount.isValid && to.isValid

  const tokenQuote = tokenPrices[selectedToken.contractAddress]?.price

  const handleAmountChange = (newAmount: string, isValid: boolean) => {
    setError(null)
    setAmount({ value: newAmount, isValid })
  }

  const handleTargetAddressChange = (address: string, isValid: boolean) => {
    setError(null)
    setTo({ value: address, isValid })
  }

  const handleSelectRecentAddress = (address: string) => {
    handleTargetAddressChange(toChecksumAddress(address, chainId), true)
    setActiveTab('address')
  }

  const handleConfirmClick = () =>
    onConfirm(selectedToken, amount.value, to.value)

  const onTokenSelect = useCallback((token: MixedTokenAndNetworkType) => {
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
  }, [])
  return (
    <View>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>asset</Text>
          <AssetChooser
            selectedAsset={selectedToken}
            assetList={tokenList}
            onAssetSelected={onTokenSelect}
          />
        </View>
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
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
            <AddressInputSelector
              initialValue={to.value}
              onChangeText={handleTargetAddressChange}
              testID={'To.Input'}
              chainId={chainId}
              token={selectedToken}
            />
            <View>
              <Text>{error}</Text>
            </View>

            <View style={styles.centerRow}>
              <TransferButton
                style={styles.button}
                onPress={handleConfirmClick}
                disabled={!isValidTransaction}
                accessibilityLabel="transfer"
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
              <Text>{error}</Text>
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
