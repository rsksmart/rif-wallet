/* eslint-disable prettier/prettier */
import { balanceToDisplay, balanceToUSD } from './utils'

describe('utils', () => {
  describe('balanceToNumber', () => {
    it('converts', () => {
      const testCases = [
        ['49695829811481680', 18, '0.04969582981148168'],
        ['0x1bc16d674ec80000', 18, '2'],
        ['0x640', 2, '16'],
        ['0x6124fee993bc0000', 18, '7'],
        ['0x1b1ae4d6e2ef50000', 18, '31.25'],
      ]

      testCases.forEach((value: any) => {
        expect(balanceToDisplay(value[0], value[1])).toEqual(value[2])
      })
    })

    it('converts and rounds', () => {
      const testCases = [
        ['49695829811481680', 18, 2, '0.04'],
        ['49695829811481680', 18, 3, '0.049'],
        ['49695829811481680', 18, 5, '0.04969'],
        ['0x1b1ae4d6e2ef50000', 18, 1, '31.2'],
      ]

      testCases.forEach((value: any) => {
        expect(balanceToDisplay(value[0], value[1], value[2])).toEqual(value[3])
      })
    })
  })

  describe('balanceToUSD', () => {
    it('converts', () => {
      const testCases = [
        { number: '49695829811481680', decimals: 18, quote: 38774.0905022375, expected: '$1926.91' },
        { number: '0x1b1ae4d6e2ef50000', decimals: 18, quote: 6.15, expected: '$192.19' },
        { number: '1000', decimals: 18, quote: 38774, expected: '< $0.01' },
      ]

      testCases.forEach((v: any) => {
        expect(balanceToUSD(v.number, v.decimals, v.quote)).toEqual(v.expected)
      })
    })
  })
})
