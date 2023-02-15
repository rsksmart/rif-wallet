/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { RIFWalletServicesFetcherInterface } from '@rsksmart/rif-wallet-services'
import {
  TransactionsServerResponse,
  ITokenWithBalance,
} from '@rsksmart/rif-wallet-services'

export const testCase: ITokenWithBalance[] = [
  {
    name: 'Tropykus cUSDT',
    symbol: 'cUSDT',
    contractAddress: '0xfde5bbfec32d0bdd483ba5d9d57947857d7a46d6',
    decimals: 18,
    balance: '0x2a912efb8012d95cf',
    logo: 'test.png',
  },
  {
    name: 'Tropykus rUSDT',
    symbol: 'rUSDT',
    contractAddress: '0x2694785f9c3006edf88df3a66ba7adf106dbd6a0',
    decimals: 18,
    balance: '0xde0b6b3a7640000',
    logo: 'test.png',
  },
  {
    name: 'Tropykus DOC',
    symbol: 'DOC',
    contractAddress: '0xe3a19295e06c83516b540fa44824ebba8926c103',
    decimals: 18,
    balance: '0xde0b6b3a7640000',
    logo: 'test.png',
  },
  {
    name: 'Tropykus cRBTC',
    symbol: 'cRBTC',
    contractAddress: '0x1fd15fa2030856f634b82f0a9c35061d3c381a93',
    decimals: 18,
    balance: '0xb18cd4a0730744',
    logo: 'test.png',
  },
  {
    name: 'Tropykus cRIF',
    symbol: 'cRIF',
    contractAddress: '0x1971fe81ff45d43b9a57f281dc7ef71b5fe19fe5',
    decimals: 18,
    balance: '0x5363c7a3523c169f73',
    logo: 'test.png',
  },
  {
    name: 'tRIF Token',
    symbol: 'tRIF',
    contractAddress: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    decimals: 18,
    balance: '0x25094dfecb53d9201',
    logo: 'test.png',
  },
]

export const txTestCase: TransactionsServerResponse = {
  data: [
    {
      hash: 'tx-one-hash',
      nonce: 4,
      blockHash:
        '0x908bc6788a16de1c921602e1988eea13e0bb41d38575e220084cb7973c6d7c04',
      blockNumber: 2298866,
      transactionIndex: 4,
      from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
      to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
      gas: 60000,
      gasPrice: '0x3938700',
      value: '0x0',
      input:
        '0x244f53b5000000000000000000000000cb46c0ddc60d18efeb0e586c17af6ea36452dae000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c9340000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000000000000',
      timestamp: 1635625511,
      receipt: {
        transactionHash:
          '0x9ba0a9bcdc0df3fb6e373133b1adfae36415b052ae91855f8873c85f377e71fb',
        transactionIndex: 4,
        blockHash:
          '0x908bc6788a16de1c921602e1988eea13e0bb41d38575e220084cb7973c6d7c04',
        blockNumber: 2298866,
        cumulativeGasUsed: 285524,
        gasUsed: 42408,
        contractAddress: null,
        logs: [
          {
            logIndex: 0,
            blockNumber: 2298866,
            blockHash:
              '0x908bc6788a16de1c921602e1988eea13e0bb41d38575e220084cb7973c6d7c04',
            transactionHash:
              '0x9ba0a9bcdc0df3fb6e373133b1adfae36415b052ae91855f8873c85f377e71fb',
            transactionIndex: 4,
            address: '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0',
            data: '0x0000000000000000000000000000000000000000000000004563918244f40000',
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x00000000000000000000000027300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            event: 'Transfer',
            args: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
              '0x4563918244f40000',
            ],
            abi: {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            signature:
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            _addresses: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            eventId: '02313f2004000220084cb7973c6d7c04',
            timestamp: 1635625511,
            txStatus: '0x1',
          },
        ],
        from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
        to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
        status: '0x1',
        logsBloom:
          '0x00000000000000000000000000000000000000000400000000000000000000000000000010000000000000000000000000200000000000000000000000000000000000000001000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000008000000000000080000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000040000000',
      },
      txType: 'contract call',
      txId: '02313f2004220084cb7973c6d7c04',
      data: '',
    },
    {
      hash: 'tx-two-hash',
      nonce: 3,
      blockHash:
        '0xb7144e5432c23e58827106325d5bf0cc2e355d9f8020a4afa60dd38bf5ea9a4f',
      blockNumber: 2298862,
      transactionIndex: 2,
      from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
      to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
      gas: 60000,
      gasPrice: '0x3938700',
      value: '0x0',
      input:
        '0x244f53b5000000000000000000000000c3de9f38581f83e281f260d0ddbaac0e102ff9f800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c9340000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000',

      timestamp: 1635625370,
      receipt: {
        transactionHash:
          '0x0fdd2b334b9e3b889b0b38162abfbcf63091cd749b664d1bd56eb39830e84709',
        transactionIndex: 2,
        blockHash:
          '0xb7144e5432c23e58827106325d5bf0cc2e355d9f8020a4afa60dd38bf5ea9a4f',
        blockNumber: 2298862,
        cumulativeGasUsed: 248629,
        gasUsed: 57408,
        contractAddress: null,
        logs: [
          {
            logIndex: 0,
            blockNumber: 2298862,
            blockHash:
              '0xb7144e5432c23e58827106325d5bf0cc2e355d9f8020a4afa60dd38bf5ea9a4f',
            transactionHash:
              '0x0fdd2b334b9e3b889b0b38162abfbcf63091cd749b664d1bd56eb39830e84709',
            transactionIndex: 2,
            address: '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8',
            data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x00000000000000000000000027300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            event: 'Transfer',
            args: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
              '0xde0b6b3a7640000',
            ],
            abi: {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            signature:
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            _addresses: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            eventId: '02313ee0020004afa60dd38bf5ea9a4f',
            timestamp: 1635625370,
            txStatus: '0x1',
          },
        ],
        from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
        to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
        status: '0x1',
        logsBloom:
          '0x00000000000000000000000000000000000000000400000000000000000000000000000000000000000000010000000000200000000000000000000000000000000000000001000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000002000000080000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000040000000',
      },
      txType: 'contract call',
      txId: '02313ee0024afa60dd38bf5ea9a4f',
      data: '',
    },
    {
      hash: 'tx-three-hash',
      nonce: 2,
      blockHash:
        '0xaadba77c5b78e5d8795021cc70a6191f9ce58a2f0b5f56df9f5dfce1ba205baa',
      blockNumber: 2298855,
      transactionIndex: 0,
      from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
      to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
      gas: 60000,
      gasPrice: '0x3938700',
      value: '0x0',
      input:
        '0x244f53b5000000000000000000000000cb46c0ddc60d18efeb0e586c17af6ea36452dae000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c934000000000000000000000000000000000000000000000000d02ab486cedc000000000000000000000000000000000000000000000000000000000000',
      timestamp: 1635625165,
      receipt: {
        transactionHash:
          '0x1bb08121c6fa881dadb64d84f11bd4ecec83835594239fc84bc943f387b1ce43',
        transactionIndex: 0,
        blockHash:
          '0xaadba77c5b78e5d8795021cc70a6191f9ce58a2f0b5f56df9f5dfce1ba205baa',
        blockNumber: 2298855,
        cumulativeGasUsed: 57408,
        gasUsed: 57408,
        contractAddress: null,
        logs: [
          {
            logIndex: 0,
            blockNumber: 2298855,
            blockHash:
              '0xaadba77c5b78e5d8795021cc70a6191f9ce58a2f0b5f56df9f5dfce1ba205baa',
            transactionHash:
              '0x1bb08121c6fa881dadb64d84f11bd4ecec83835594239fc84bc943f387b1ce43',
            transactionIndex: 0,
            address: '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0',
            data: '0x000000000000000000000000000000000000000000000000d02ab486cedc0000',
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x00000000000000000000000027300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            event: 'Transfer',
            args: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
              '0xd02ab486cedc0000',
            ],
            abi: {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            signature:
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            _addresses: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            eventId: '02313e70000006df9f5dfce1ba205baa',
            timestamp: 1635625165,
            txStatus: '0x1',
          },
        ],
        from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
        to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
        status: '0x1',
        logsBloom:
          '0x00000000000000000000000000000000000000000400000000000000000000000000000010000000000000000000000000200000000000000000000000000000000000000001000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000008000000000000080000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000040000000',
      },
      txType: 'contract call',
      txId: '02313e70006df9f5dfce1ba205baa',
      data: '',
    },
    {
      hash: 'tx-four-hash',
      nonce: 1,
      blockHash:
        '0x2b14bc112b1d5c2a985d2724dae7ff5ebb0c3fad59f6150e021d226648b1445c',
      blockNumber: 2298829,
      transactionIndex: 8,
      from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
      to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
      gas: 60000,
      gasPrice: '0x3938700',
      value: '0x0',
      input:
        '0x244f53b500000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c9340000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000',

      timestamp: 1635624364,
      receipt: {
        transactionHash:
          '0x25e1045b1650c7e55f964502403a078a24102964ea7b98fdcc968236ef4d47e4',
        transactionIndex: 8,
        blockHash:
          '0x2b14bc112b1d5c2a985d2724dae7ff5ebb0c3fad59f6150e021d226648b1445c',
        blockNumber: 2298829,
        cumulativeGasUsed: 638206,
        gasUsed: 42189,
        contractAddress: null,
        logs: [
          {
            logIndex: 0,
            blockNumber: 2298829,
            blockHash:
              '0x2b14bc112b1d5c2a985d2724dae7ff5ebb0c3fad59f6150e021d226648b1445c',
            transactionHash:
              '0x25e1045b1650c7e55f964502403a078a24102964ea7b98fdcc968236ef4d47e4',
            transactionIndex: 8,
            address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
            data: '0x0000000000000000000000000000000000000000000000001bc16d674ec80000',
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x00000000000000000000000027300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            event: 'Transfer',
            args: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
              '0x1bc16d674ec80000',
            ],
            abi: {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            signature:
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            _addresses: [
              '0x27300ed4a9c66cc6374f1cec836a1b273c233b75',
              '0x1d4f6a5fe927f0e0e4497b91cebfbcf64da1c934',
            ],
            eventId: '02313cd00800050e021d226648b1445c',
            timestamp: 1635624364,
            txStatus: '0x1',
          },
        ],
        from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
        to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
        status: '0x1',
        logsBloom:
          '0x0000000000000000000000000000000000000000040000000000010000000000000000000000000000000000000000000020000000000000000000000000000000000000000100000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000c000000000000000000000400000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000',
      },
      txType: 'contract call',
      txId: '02313cd00850e021d226648b1445c',
      data: '',
    },
  ],
  prev: null,
  next: null,
}

export const createMockFetcher = (): RIFWalletServicesFetcherInterface => ({
  fetchTokensByAddress: jest.fn(() => Promise.resolve([...testCase])),
  fetchTransactionsByAddress: jest.fn(() => Promise.resolve(txTestCase)),
  fetchDapps: jest.fn(),
})

export const lastToken = testCase[testCase.length - 1]
export const lastTokenTextTestId = `${lastToken.contractAddress}.Text`

export const lastTx = txTestCase.data[txTestCase.data.length - 1]
export const lastTxTextTestId = `${lastTx.hash}.View`
