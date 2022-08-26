import { Transaction } from 'ethers'

export class RifRelayLight {
  // private chainId: number
  private provider: any // Ethers Provider
  private hubAddress: string
  // private addresses: SDKAddresses

  constructor(provider: any, hubAddress: string) {
    this.provider = provider
    this.hubAddress = hubAddress
  }

  createRelayRequest = (transaction: Transaction) => {
    console.log('creating relay request...')
    const relayRequestManual = {
      request: {
        relayHub: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
        from: this.provider.signer.address, // '0xa735b445583D00aaB60abcb1AfE67FD6ffA5039C', // EOA address
        to: transaction.to, // '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        data: transaction.data, // '0xa9059cbb0000000000000000000000003dd03d7d6c3137f1eb7582ba5957b8a2e26f304a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
        value: transaction.value, // '0',
        gas: '0x41f9',
        nonce: '1',
        tokenContract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        tokenAmount: '0',
        tokenGas: '65164000',
      },
      relayData: {
        gasPrice: '65164000',
        relayWorker: '0x74105590d404df3f384a099c2e55135281ca6b40',
        callForwarder: '0x06c439A2C332C639e9B1AEA4a7F371aEAdB999Dd',
        callVerifier: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
        domainSeparator:
          '0x44649f761bbaf55f4a957109dbc787a68ed6833e18b1bc7b120d52440ec06afc',
      },
    }

    return relayRequestManual
  }
}
