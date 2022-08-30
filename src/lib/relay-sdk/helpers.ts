import { bufferToHex } from 'ethereumjs-util'
import { EIP712Domain, TypedDataUtils } from 'eth-sig-util'
import {
  Address,
  DeployRequestType,
  DomainSeparatorType,
  EIP712DomainType,
  PrefixedHexString,
  RelayDataType,
  RelayRequestType,
} from './types'

export const dataTypeFields = (isDeployRequest: boolean) =>
  isDeployRequest
    ? {
        RelayRequest: DeployRequestType,
        RelayData: RelayDataType,
      }
    : {
        RelayRequest: RelayRequestType,
        RelayData: RelayDataType,
      }

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

export function getDomainSeparatorHash(
  verifier: Address,
  chainId: number,
): PrefixedHexString {
  return bufferToHex(
    TypedDataUtils.hashStruct(
      'EIP712Domain',
      getDomainSeparator(verifier, chainId),
      { EIP712Domain: EIP712DomainType },
    ),
  )
}
