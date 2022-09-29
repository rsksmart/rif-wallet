import React, { useState, useEffect } from 'react'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { UnspentTransactionType } from '../../lib/bitcoin/payments/BIP84Payment'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, grid } from '../../styles'
import AssetChooser from './AssetChooser'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { BlueButton } from '../../components/button/ButtonVariations'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ContentPasteIcon } from '../../components/icons'
import Icon from 'react-native-vector-icons/Ionicons'

type SendBitcoinScreenType = {
  network: BitcoinNetwork
}
const SendBitcoinScreen: React.FC<SendBitcoinScreenType> = ({
  route: {
    params: { network },
  },
}) => {
  const [utxos, setUtxos] = useState<Array<UnspentTransactionType>>([])
  const [amountToPay, setAmountToPay] = useState<string>('0')
  const [addressToPay, setAddressToPay] = useState<string>(
    'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre',
  )
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

  const handleAddressToPayChange = (address: string) => {
    setAddressToPay(address)
  }

  const onReviewTouch = () => {
    const hexData = network.bips[0].paymentInstance.generateHexPayment(
      Number(amountToPay),
      addressToPay,
      utxos,
    )
    console.log(hexData)
  }
  return (
    <View style={styles.container}>
      <View style={{ ...grid.row, ...styles.section }}>
        <View style={grid.column12}>
          <Text style={styles.label}>asset</Text>
          <AssetChooser
            selectedToken={network as ITokenWithBalance}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
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
})
export default SendBitcoinScreen
