import { EIP712Domain } from 'eth-sig-util'
import {
  DeployRequestType,
  DomainSeparatorType,
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
