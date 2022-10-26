import { BigNumber, utils } from 'ethers'
import BIP from './BIP'

export function convertBtcToSatoshi(btc: string) {
  return utils.parseUnits(btc, 8)
}

export function convertSatoshiToBtcHuman(satoshi: number | string | BigNumber) {
  return utils.formatUnits(BigNumber.from(satoshi), 8)
}

export function isBitcoinAddressValid(addressToPay: string, bip: BIP): boolean {
  return addressToPay.startsWith(bip.networkInfo.bech32)
}
