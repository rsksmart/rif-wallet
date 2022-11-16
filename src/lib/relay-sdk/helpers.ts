import { BigNumber } from 'ethers'
import {
  DeployRequestType,
  DomainSeparatorType,
  RelayDataType,
  RelayRequestType,
} from './types'

export interface EIP712Domain {
  name?: string | undefined
  version?: string | undefined
  chainId?: string | number | undefined
  verifyingContract?: string | undefined
  salt?: string | undefined
}

export const dataTypeFields = (isDeployRequest: boolean) => ({
  RelayRequest: isDeployRequest ? DeployRequestType : RelayRequestType,
  RelayData: RelayDataType,
})

export function getDomainSeparator(
  verifyingContract: string,
  chainId: number,
): EIP712Domain {
  return {
    name: DomainSeparatorType.name,
    version: DomainSeparatorType.version,
    chainId: chainId,
    verifyingContract: verifyingContract,
  }
}

export const MAX_RELAY_NONCE_GAP = 3
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const INTERNAL_TRANSACTION_ESTIMATE_CORRECTION = 20000
export const RIF_TOKEN_ADDRESS_TESTNET =
  '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'
export const TWO_RIF = BigNumber.from('2000000000000000000')
