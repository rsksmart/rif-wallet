import { BigNumber, utils } from 'ethers'

export function convertBtcToSatoshi(btc: string) {
  return utils.parseUnits(btc, 8)
}

export function convertSatoshiToBtcHuman(satoshi: number | string | BigNumber) {
  return utils.formatUnits(BigNumber.from(satoshi), 8)
}
