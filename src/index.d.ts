declare module '@rsksmart/rsk-utils' {
  export function toChecksumAddress(address: string, chainId?: number): string
  export function isValidChecksumAddress(
    address: string,
    chainId?: number,
  ): boolean
  export function isAddress(address: string): boolean
}
