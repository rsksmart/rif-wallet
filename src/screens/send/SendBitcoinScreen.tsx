import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, grid } from '../../styles'
import AssetChooser from './AssetChooser'
import { BlueButton } from '../../components/button/ButtonVariations'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ContentPasteIcon } from '../../components/icons'
import Icon from 'react-native-vector-icons/Ionicons'
import { MediumText } from '../../components'
import Clipboard from '@react-native-community/clipboard'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { UnspentTransactionType } from '../../lib/bitcoin/types'

type SendBitcoinScreenType = {
  route: {
    params: {
      network: BitcoinNetwork
    }
  }
}
const SendBitcoinScreen: React.FC<SendBitcoinScreenType> = ({
  route: {
    params: { network },
  },
}) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [amountToPay, setAmountToPay] = useState<string>('1111')
  const [addressToPay, setAddressToPay] = useState<string>(
    'tb1qxctqphp7l5zeh2a38ehaqe3asz33luxr9mv9yx',
  )
  const [miningFee, setMiningFee] = useState<string>('141')
  const [status, setStatus] = useState<string>('')
  const [txid, setTxid] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fetchUtxo = async () => {
    network.bips[0]
      .fetchUtxos()
      .then((data: Array<UnspentTransactionType>) => setUtxos(data))
  }
  useEffect(() => {
    // Fetch UTXOs
    fetchUtxo()
  }, [])

  const handleAmountChange = (amount: string) => {
    setAmountToPay(amount)
  }

  const isAddressValid = (): boolean => {
    return addressToPay.startsWith(network.bips[0].networkInfo.bech32)
  }
  const handleAddressToPayChange = (address: string) => {
    setAddressToPay(address)
  }
  const handleMiningFeeChange = (miningFeeValue: string) => {
    setMiningFee(miningFeeValue)
  }
  const balance = network.bips[0].balance
  const onReviewTouch = async () => {
    if (Number(amountToPay) > Number(balance)) {
      setStatus(`Amount must not be greater than ${balance}`)
      return
    }
    if (Number(miningFee) <= 0) {
      setStatus('Mining fee must be over 0')
      return
    }
    if (!isAddressValid()) {
      setStatus('Address is not valid. Please verify')
      return
    }
    setTxid('')
    setError('')
    // @TODO: refactor to use request
    setStatus('Loading payment...')
    network.bips[0].payment
      .onRequestPayment({
        amountToPay: Number(amountToPay),
        addressToPay,
        unspentTransactions: utxos,
        miningFee: Number(miningFee),
      })
      .then(async () => {
        setStatus('Sending payment...')
        const txIdJson =
          await network.bips[0].payment.onRequestPaymentConfirmed()
        if (txIdJson.result) {
          setStatus(`${txIdJson.result}`)
          setTxid(txIdJson.result)
        } else {
          setStatus(`Transaction Error: ${txIdJson.error}`)
          setError(txIdJson.error)
        }
      })
      .catch((err: { toString: () => any }) => {
        console.log('Payment rejected', err.toString())
      })
  }

  const onTransactionCopy = (type: string) => () => {
    if (type === 'error') {
      Clipboard.setString(error)
    } else {
      Clipboard.setString(txid)
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>asset</Text>
          <AssetChooser
            selectedToken={network as any}
            tokenList={[]}
            handleTokenSelection={() => {}}
          />
        </View>
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>amount</Text>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={handleAmountChange}
            value={amountToPay}
            placeholder="0.00"
            keyboardType="numeric"
            testID={'Amount.Input'}
            placeholderTextColor={colors.gray}
          />
        </View>
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>mining fee</Text>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={handleMiningFeeChange}
            value={miningFee}
            placeholder="0.00"
            keyboardType="numeric"
            testID={'Amount.MiningFee'}
            placeholderTextColor={colors.gray}
          />
        </View>
      </View>
      <View>
        <>
          <Text style={styles.label}>address</Text>
          <View style={grid.row}>
            <View style={styles.addressContainer}>
              <TextInput
                style={styles.addressInput}
                onChangeText={handleAddressToPayChange}
                autoCapitalize="none"
                autoCorrect={false}
                value={addressToPay}
                placeholder="Type Address"
                editable={true}
                placeholderTextColor={colors.text.secondary}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {}}
                testID="Address.PasteButton">
                <ContentPasteIcon
                  color={colors.text.secondary}
                  height={22}
                  width={22}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {}}
                testID="Address.ClearButton">
                <View style={styles.closeButton}>
                  <Icon
                    name="close-outline"
                    style={styles.iconClose}
                    size={15}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.centerRow}>
            <BlueButton
              underlayColor={'red'}
              onPress={onReviewTouch}
              title="review"
            />
          </View>
        </>
      </View>
      <View style={styles.statusView}>
        {status !== '' && (
          <TouchableOpacity
            onPress={onTransactionCopy(error !== '' ? 'error' : 'txid')}>
            <View style={styles.addressContainer}>
              <MediumText style={styles.label}>{status}</MediumText>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    color: colors.white,
    padding: 10,
  },
  textInputStyle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 22,
    backgroundColor: colors.darkPurple4,
  },
  addressContainer: {
    backgroundColor: colors.darkPurple5,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 20,
  },
  addressInput: {
    flex: 5,
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 30,
    padding: 2,
  },
  iconClose: {
    color: colors.lightPurple,
  },
  centerRow: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusView: {
    marginTop: 20,
  },
})
export default SendBitcoinScreen
