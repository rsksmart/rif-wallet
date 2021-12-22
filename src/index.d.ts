declare module '@rsksmart/rsk-utils' {
  export function toChecksumAddress(address: string, chainId?: number): string
  export function isValidChecksumAddress(
    address: string,
    chainId?: number,
  ): boolean
  export function isAddress(address: string): boolean
}

declare module '@rsksmart/rns-sdk' {
  import { Signer, BigNumber, ContractTransaction } from 'ethers'
  export class RNS {
    constructor(rnsRegistryAddress: string, signer: Signer)
    setOwner(domain: string, owner: string): Promise<ContractTransaction>
    getOwner(domain: string): Promise<string>
    setResolver(domain: string, resolver: string): Promise<ContractTransaction>
    getResolver(domain: string): Promise<string>
    setSubdomainOwner(
      domain: string,
      label: string,
      owner: string,
    ): Promise<ContractTransaction>
  }
  export class AddrResolver {
    constructor(rnsRegistryAddress: string, signer: Signer)
    setAddr(domain: string, addr: string): Promise<ContractTransaction>
    addr(domain: string): Promise<string>
  }

  export class RSKRegistrar {
    constructor(
      rskOwnerAddress: string,
      fifsAddrRegistrarAddress: string,
      rifTokenAddress: string,
      signer: Signer,
    )
    available(label: string): Promise<string>
    ownerOf(label: string): Promise<string>
    price(label: string, duration: BigNumber): Promise<BigNumber>
    commitToRegister(
      label: string,
      owner: string,
    ): Promise<{
      secret: string
      makeCommitmentTransaction: ContractTransaction
      canReveal: () => Promise<boolean>
    }>
    register(
      label: string,
      owner: string,
      secret: string,
      duration: BigNumber,
      amount: BigNumber,
      addr?: string,
    ): Promise<ContractTransaction>
  }
}
