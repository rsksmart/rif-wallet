import { decodeString } from './decodeString'

describe('decodeString', () => {
  it('returns an address', () => {
    expect(
      decodeString('0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A'),
    ).toMatchObject({
      address: '0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A',
    })
  })

  it('returns an address and network (i.e. metamask)', () => {
    expect(
      decodeString('ethereum:0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A'),
    ).toMatchObject({
      network: 'ethereum',
      address: '0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A',
    })
  })

  describe('real eip681 examples', () => {
    it('returns an address and network when given extra parameters', () => {
      expect(
        decodeString(
          'rsktestnet:0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A@31/transfer?value=.001',
        ),
      ).toMatchObject({
        network: 'rsktestnet',
        address: '0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A',
      })
    })

    it('ERC20 payment link', () => {
      expect(
        decodeString(
          'rsk:0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A/transfer?address=0x3Dd03d7d6c3137f1Eb7582Ba5957b8A2e26f304A&uint256=5e1',
        ),
      ).toMatchObject({
        address: '0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A',
        network: 'rsk',
      })
    })
  })

  it('ignores the pay remark in address', () => {
    expect(
      decodeString('rsktestnet:pay-0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A'),
    ).toMatchObject({
      network: 'rsktestnet',
      address: '0x19d03d7d6c3137f1Eb7582Ba5957b8A2e26f304A',
    })
  })

  describe('returns nothing', () => {
    it('junk text', () => {
      expect(decodeString('ashjdhasjdkasd')).toMatchObject({})
    })

    it('junk text with colon', () => {
      expect(decodeString('ashjdhas:4jdkasd')).toMatchObject({})
    })
  })
})
