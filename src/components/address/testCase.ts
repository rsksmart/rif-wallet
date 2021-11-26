const checksummed = '0x086B01d6cFcb0123166f92F219d2A617a6945896'

export const testnetCase = {
  checksummed,
  lower: checksummed.toLowerCase(),
  wrongChecksum: checksummed.replace('a', 'A'),
  invalid: checksummed.slice(0, 10),
  domainWithAddress: 'moonwalker.rsk',
}
