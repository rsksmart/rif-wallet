import { ITokenWithBalance } from './RIFWalletServicesTypes'

export class RifWalletServicesFetcherMock {
  public async fetchTokensByAddress(
    smartAddress: string,
  ): Promise<ITokenWithBalance[]> {
    console.log('Mocking response tokens for: ', smartAddress)
    const tokens = [
      {
        name: 'Tropykus cUSDT',
        symbol: 'cUSDT',
        contractAddress: '0xfde5bbfec32d0bdd483ba5d9d57947857d7a46d6',
        decimals: 18,
        balance: '0x2a912efb8012d95cf',
      },
      {
        name: 'Tropykus rUSDT',
        symbol: 'rUSDT',
        contractAddress: '0x2694785f9c3006edf88df3a66ba7adf106dbd6a0',
        decimals: 18,
        balance: '0xde0b6b3a7640000',
      },
      {
        name: 'Tropykus DOC',
        symbol: 'DOC',
        contractAddress: '0xe3a19295e06c83516b540fa44824ebba8926c103',
        decimals: 18,
        balance: '0xde0b6b3a7640000',
      },
      {
        name: 'Tropykus cRBTC',
        symbol: 'cRBTC',
        contractAddress: '0x1fd15fa2030856f634b82f0a9c35061d3c381a93',
        decimals: 18,
        balance: '0xb18cd4a0730744',
      },
      {
        name: 'Tropykus cRIF',
        symbol: 'cRIF',
        contractAddress: '0x1971fe81ff45d43b9a57f281dc7ef71b5fe19fe5',
        decimals: 18,
        balance: '0x5363c7a3523c169f73',
      },
      {
        name: 'tRIF Token',
        symbol: 'tRIF',
        contractAddress: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        decimals: 18,
        balance: '0x25094dfecb53d9201',
      },
    ]
    return tokens as ITokenWithBalance[]
  }
}
