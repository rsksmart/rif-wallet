/**
 * EIP-712 Domain type used for typed data signing validation and display
 */
export interface EIP712Domain {
  name?: string
  version?: string
  chainId?: number
  verifyingContract?: string
}

/**
 * Parameters passed to domain validation functions
 */
export interface DomainValidationParams {
  domain: EIP712Domain
  message?: unknown
  types?: unknown
}

/**
 * Parsed EIP-712 typed data structure
 */
export interface ParsedTypedData {
  domain: EIP712Domain
  message: Record<string, unknown>
  types: Record<string, unknown>
}

/**
 * WalletConnect signing request data for the confirmation modal
 */
export interface WalletConnectSigningRequest {
  method: string
  params: unknown[]
  dappName?: string
  dappUrl?: string
}

/**
 * Custom SignTypedDataV4 resolver that properly calls validate()
 *
 * The library's SignTypedDataV4Resolver doesn't call validate() in its resolve method,
 * unlike SignTypedDataResolver. This custom implementation ensures validation is executed.
 *
 * This is a critical security fix for the vulnerability:
 * "WalletConnect v2 eth_signTypedData_v4 bypasses domain validation"
 */
export class SecureSignTypedDataV4Resolver {
  methodName = 'eth_signTypedData_v4'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private signer: any
  validate: (params: DomainValidationParams) => void = () => {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(signer: any) {
    this.signer = signer
  }

  async resolve(params: string[]): Promise<string> {
    const { domain, message, types } = JSON.parse(params[1])

    // Delete EIP712Domain from types (standard practice for EIP-712)
    if (types.EIP712Domain) {
      delete types.EIP712Domain
    }

    // CRITICAL: Call validation before signing
    // This is what was missing in the library's SignTypedDataV4Resolver
    this.validate({ domain, message, types })

    return this.signer._signTypedData(domain, types, message)
  }
}
