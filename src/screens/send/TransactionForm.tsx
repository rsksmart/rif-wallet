import { toChecksumAddress } from '@rsksmart/rsk-utils'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AddressInput } from '../../components'
import { Tabs } from '../../components/'
import { BlueButton } from '../../components/button/ButtonVariations'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { colors, grid } from '../../styles'
import { IActivityTransaction, IPrice } from '../../subscriptions/types'
import AssetChooser from './AssetChooser'
import { RecentTransactions } from './RecentTransactions'
import SetAmountComponent from './SetAmountComponent'

interface Interface {
  onConfirm: (
    selectedToken: ITokenWithBalance,
    amount: string,
    to: string,
  ) => void
  tokenList: ITokenWithBalance[]
  tokenPrices: Record<string, IPrice>
  chainId: number
  initialValues: {
    asset?: ITokenWithBalance
    amount?: string
    recipient?: string
  }
  transactions: IActivityTransaction[]
}

const TransactionForm: React.FC<Interface> = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  transactions,
  onConfirm,
}) => {
  const [selectedToken, setSelectedToken] = useState<ITokenWithBalance>(
    initialValues.asset || tokenList[0],
  )
  const [activeTab, setActiveTab] = useState('address')

  interface txDetail {
    value: string
    isValid: boolean
  }

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

  return (
    <View style={styles.container}>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>asset</Text>
          <AssetChooser
            selectedToken={selectedToken}
            tokenList={tokenList}
            handleTokenSelection={(token: ITokenWithBalance) =>
              setSelectedToken(token)
            }
          />
        </View>
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>amount</Text>
          <SetAmountComponent
            setAmount={handleAmountChange}
            token={selectedToken}
            usdAmount={tokenQuote}
          />
        </View>
      </View>
      <View>
        <Tabs
          title={'recipient'}
          tabs={['address', 'recent', 'contact']}
          selectedTab={activeTab}
          onTabSelected={setActiveTab}
        />
        {activeTab === 'address' && (
          <>
            <AddressInput
              initialValue={to.value}
              onChangeText={handleTargetAddressChange}
              testID={'To.Input'}
              chainId={chainId}
            />
            <View>
              <Text>{error}</Text>
            </View>

            <View style={styles.centerRow}>
              <BlueButton
                underlayColor={'red'}
                onPress={handleConfirmClick}
                disabled={!isValidTransaction}
                title="review"
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
  container: {
    minHeight: '100%',
    backgroundColor: colors.darkPurple3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
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

export default TransactionForm
