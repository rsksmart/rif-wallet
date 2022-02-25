import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AddressInput } from '../../components'
import { BaseButton } from '../../components/button/BaseButton'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { IPrice } from '../../subscriptions/types'
import AssetChooser from './AssetChooser'
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
}

const TransactionForm: React.FC<Interface> = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  onConfirm,
}) => {
  const [selectedToken, setSelectedToken] = useState<ITokenWithBalance>(
    initialValues.asset || tokenList[0],
  )
  const [amount, setAmount] = useState<string>(initialValues.amount || '0')
  const [to, setTo] = useState<string>(initialValues.recipient || '')
  const [error, setError] = useState<string | null>(null)

  const tokenQuote = tokenPrices[selectedToken.contractAddress]?.price

  const handleTargetAddressChange = (address: string) => {
    setError(null)
    setTo(address)
  }

  const handleConfirmClick = () => onConfirm(selectedToken, amount, to)

  return (
    <View>
      <View style={grid.row}>
        <View style={grid.column5}>
          <Text style={styles.label}>choose asset</Text>
          <AssetChooser
            selectedToken={selectedToken}
            tokenList={tokenList}
            handleTokenSelection={(token: ITokenWithBalance) =>
              setSelectedToken(token)
            }
          />
        </View>
        <View style={{ ...grid.column7, ...grid.offset1 }}>
          <Text style={styles.label}>set amount</Text>
          <SetAmountComponent
            setAmount={setAmount}
            token={selectedToken}
            usdAmount={tokenQuote}
          />
        </View>
      </View>
      <View>
        <Text style={styles.label}>choose recipient</Text>
        <AddressInput
          initialValue={to}
          onChangeText={handleTargetAddressChange}
          testID={'To.Input'}
          chainId={chainId}
        />
      </View>

      <View>
        <Text>{error}</Text>
      </View>

      <View style={styles.centerRow}>
        <BaseButton onPress={handleConfirmClick}>
          <Text style={styles.confirmButton}>Confirm</Text>
        </BaseButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: colors.white,
    marginBottom: 5,
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
  confirmButton: {
    color: colors.white,
  },
})

export default TransactionForm
