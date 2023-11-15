// this is a random example from ther Ethers Github
export const domain = {
  name: 'testDomain',
  version: '1',
  chainId: 31337,
  verifyingContract: '0x1429859428c0abc9c2c47c8ee9fbaf82cfa0f20f',
}

export const types = {
  Permit: [
    { name: 'permitHash', type: 'bytes32' },
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
  ],
}

export const value = {
  permitHash:
    '0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9',
  owner: '0x17ec8597ff92c3f44523bdc65bf0f1be632917ff',
  spender: '0x63fc2ad3d021a4d7e64323529a55a9442c444da0',
  value: '2000000000000000000',
}
