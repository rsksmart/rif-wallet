/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { IAbiEnhancer, EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'

import { IActivityTransaction } from 'src/subscriptions/types'

export const enhancedTxTestCase: EnhancedResult = {
  from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
  to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
  symbol: 'RIF',
  balance: 'balance',
  value: '32',
}

export const createMockAbiEnhancer = (): IAbiEnhancer => ({
  enhance: jest.fn(() => Promise.resolve(enhancedTxTestCase)),
})

// 4 transactions, 2 different addresses
export const activityTxTestCase: IActivityTransaction[] = [
  {
    originTransaction: {
      hash: '0x7dbd8196583f8a03aa60eb6ded932006c9bb75f2ee7d3615aa4dc4b6573e6b10',
      nonce: 4,
      blockHash:
        '0xc8a3a84994f19645f83661ba9ed874e6c307512a961efc290fe360c2861cf558',
      blockNumber: 3003460,
      transactionIndex: 0,
      from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
      to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
      gas: 51979,
      gasPrice: '0x3ec4458',
      value: '0x0',
      input:
        '0x244f53b500000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000fbd1cb816f073c554296bfff2be2ddb66ced83fd000000000000000000000000000000000000000000000000a688906bd8b0000000000000000000000000000000000000000000000000000000000000',
      //   v: '0x62',
      //   r: '0x5d6d1271ec20c86467cca7c3460a16ceefe7794fa1c468413258f7474bf86a49',
      //   s: '0x1e2097e16399e9618e10f57dd4f386da84c105a2730d73e506e3a3c410dfa35a',
      timestamp: 1657742352,
      receipt: {
        transactionHash:
          '0x7dbd8196583f8a03aa60eb6ded932006c9bb75f2ee7d3615aa4dc4b6573e6b10',
        transactionIndex: 0,
        blockHash:
          '0xc8a3a84994f19645f83661ba9ed874e6c307512a961efc290fe360c2861cf558',
        blockNumber: 3003460,
        cumulativeGasUsed: 51979,
        gasUsed: 51979,
        contractAddress: null,
        logs: [],
        from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
        to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
        status: '0x0',
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
      txType: 'contract call',
      txId: '02dd444000c290fe360c2861cf558',
    },
    enhancedTransaction: {
      from: '0xE9Ee02EfB1406A4F1B8e38Ea1647A44CC57FfdE2',
      to: '0xFBd1cb816f073c554296bFff2BE2dDB66Ced83fD',
      data: '0xa9059cbb000000000000000000000000fbd1cb816f073c554296bfff2be2ddb66ced83fd000000000000000000000000000000000000000000000000a688906bd8b00000',
      value: '12',
      symbol: 'tRIF',
      balance: '105',
    },
  },
  {
    originTransaction: {
      hash: '0xc8f727991b842c85c77c4f284a7d1cc373cdfe1f7486710bd8e5653e8dc7d01c',
      nonce: 3,
      blockHash:
        '0x87cfd84562a4f1466245e906b672d5a28ded6d8b6ec9e9c5b18f70a9c666ea8d',
      blockNumber: 3003449,
      transactionIndex: 0,
      from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
      to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
      gas: 51979,
      gasPrice: '0x3ec4458',
      value: '0x0',
      input:
        '0x244f53b500000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000a2193a393aa0c94a4d52893496f02b56c61c36a10000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000000000000',
      //   v: '0x62',
      //   r: '0x3dda98bff8fc9ee94c997e8ddc7b515fa12be90704e91860d6b30a63b7db3224',
      //   s: '0x6634b7845402b42557b5d6855c0b31bbf60af172850cc5daf5316479bebefd8b',
      timestamp: 1657741952,
      receipt: {
        transactionHash:
          '0xc8f727991b842c85c77c4f284a7d1cc373cdfe1f7486710bd8e5653e8dc7d01c',
        transactionIndex: 0,
        blockHash:
          '0x87cfd84562a4f1466245e906b672d5a28ded6d8b6ec9e9c5b18f70a9c666ea8d',
        blockNumber: 3003449,
        cumulativeGasUsed: 51979,
        gasUsed: 51979,
        contractAddress: null,
        logs: [],
        from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
        to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
        status: '0x0',
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
      txType: 'contract call',
      txId: '02dd4390009c5b18f70a9c666ea8d',
    },
    enhancedTransaction: {
      from: '0xE9Ee02EfB1406A4F1B8e38Ea1647A44CC57FfdE2',
      to: '0xa2193A393aa0c94A4d52893496F02B56C61c36A1',
      data: '0xa9059cbb000000000000000000000000a2193a393aa0c94a4d52893496f02b56c61c36a10000000000000000000000000000000000000000000000004563918244f40000',
      value: '5',
      symbol: 'tRIF',
      balance: '105',
    },
  },
  {
    originTransaction: {
      hash: '0x9127a598dbd4642bc2a81628117a63935ed4ad124b84af4d9b8868b50d3ae158',
      nonce: 2,
      blockHash:
        '0x32441b2ea22da80a1b287ae06af051e83fb2f3f02b590b6049cef2a329871cab',
      blockNumber: 3003286,
      transactionIndex: 0,
      from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
      to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
      gas: 51979,
      gasPrice: '0x3ec4458',
      value: '0x0',
      input:
        '0x244f53b500000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000a2193a393aa0c94a4d52893496f02b56c61c36a10000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000000000000',
      //   v: '0x62',
      //   r: '0xe8da103cc06fd3f20977313e2ef1a51e3f87746ae5cbdd6c8952954ee9e01e72',
      //   s: '0x3cb86e5d1f3f704f0f9885e53c5d3cb81fd1f17fda32a69c6344ecfb9ddb8f05',
      timestamp: 1657737122,
      receipt: {
        transactionHash:
          '0x9127a598dbd4642bc2a81628117a63935ed4ad124b84af4d9b8868b50d3ae158',
        transactionIndex: 0,
        blockHash:
          '0x32441b2ea22da80a1b287ae06af051e83fb2f3f02b590b6049cef2a329871cab',
        blockNumber: 3003286,
        cumulativeGasUsed: 51979,
        gasUsed: 51979,
        contractAddress: null,
        logs: [],
        from: '0x1bc380e0aa513d455b110bba8a9997b55b31f4ce',
        to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
        status: '0x0',
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
      txType: 'contract call',
      txId: '02dd396000b6049cef2a329871cab',
    },
    enhancedTransaction: {
      from: '0xE9Ee02EfB1406A4F1B8e38Ea1647A44CC57FfdE2',
      to: '0xa2193A393aa0c94A4d52893496F02B56C61c36A1',
      data: '0xa9059cbb000000000000000000000000a2193a393aa0c94a4d52893496f02b56c61c36a10000000000000000000000000000000000000000000000004563918244f40000',
      value: '5',
      symbol: 'tRIF',
      balance: '105',
    },
  },
  {
    originTransaction: {
      hash: '0x2a67ea44c0bb725dba2bdb57d3163ac2230d26ad29290a20c7a25ccd017ea565',
      nonce: 24532,
      blockHash:
        '0x5bdb594c5cffeb82b4f6cb510d358e32a7ac16e9708e816f3d6e1087f134b36b',
      blockNumber: 3000459,
      transactionIndex: 1,
      from: '0x88250f772101179a4ecfaa4b92a983676a3ce445',
      to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
      gas: 800000,
      gasPrice: '0x3938700',
      value: '0xb1a2bc2ec50000',
      input: '0x',
      //   v: '0x1c',
      //   r: '0xd0c858c2ff53afed6ab1fbd76da059bfba0e3ba58135144bd191591de652c1a8',
      //   s: '0x1e0048000b257ffec51e149e1ab370b3e084b03281583f83defef8e02675ac44',
      timestamp: 1657649979,
      receipt: {
        transactionHash:
          '0x2a67ea44c0bb725dba2bdb57d3163ac2230d26ad29290a20c7a25ccd017ea565',
        transactionIndex: 1,
        blockHash:
          '0x5bdb594c5cffeb82b4f6cb510d358e32a7ac16e9708e816f3d6e1087f134b36b',
        blockNumber: 3000459,
        cumulativeGasUsed: 213444,
        gasUsed: 21000,
        contractAddress: null,
        logs: [],
        from: '0x88250f772101179a4ecfaa4b92a983676a3ce445',
        to: '0xe9ee02efb1406a4f1b8e38ea1647a44cc57ffde2',
        status: '0x1',
        logsBloom:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
      txType: 'normal',
      txId: '02dc88b00116f3d6e1087f134b36b',
    },
  },
]
