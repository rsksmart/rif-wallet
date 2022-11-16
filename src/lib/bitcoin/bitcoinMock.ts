/**
 * Bitcoin addresses mock arrays, with BIP 44 and BIP 84 arrays
 */
export const bitcoinValidTestnetBIP84Addresses = [
  'tb1ql53g6x25ztex2lvyjl5efxt5cd9yx0eyrwupcw',
  'tb1qhfmf4xfwyqwhphq23q9x8yp54depvff36f6avt',
  'tb1q7lgervpy9t8ahr394602a7qdu9e4fh3hw80spl',
  'tb1qua52g5y0qgu4pgrm0p8dknad44xsd3w7xxu4wl',
  'tb1qfz24n8xle5z55v0mg4udglc75pyk0a8l4x529s',
]

export const bitcoinInvalidTestnetBIP84Addresses = [
  'tb1ql53g6x25zaex2lvyjl5efxt5cd9yx0eyrwupcw',
  'tb1qhfmf4xfwyawhphq23q9x8yp54depvff36f6avt',
  'tb1q7lgervpy9a8ahr394602a7qdu9e4fh3hw80spl',
  'tb1qua52g5y0qau4pgrm0p8dknad44xsd3w7xxu4wl',
  'tb1qfz24n8xleaz55v0mg4udglc75pyk0a8l4x529s',
]

export const bitcoinValidMainnetBIP84Addresses = [
  'bc1qmcq9e645zjkyg0yq6qlvsz9fmdh52np2cx2rek',
  'bc1q3qt33eqs3tet77g474n46psthlv8jgn8uljqnh',
  'bc1qfpp8tv34k9zu88w0f9c4vg6n93zdxsy46lhgsn',
  'bc1qcmkz5wxueqespzp8ucqp6twsq59pruwlr5s6rq',
  'bc1qadjmq3j5ly5w4f2k3zxnpw2qk609asnkkfdecc',
]

export const bitcoinInvalidMainnetBIP84Addresses = [
  'bc1qmcq9e645zjkyg0yq6qlvsd9fmdh52np2cx2rek',
  'bc1q3qt33eqs3tet77g474n46dsthlv8jgn8uljqnh',
  'bc1qfpp8tv34k9zu88w0f9c4vd6n93zdxsy46lhgsn',
  'bc1qcmkz5wxueqespzp8ucqp6dwsq59pruwlr5s6rq',
  'bc1qadjmq3j5ly5w4f2k3zxnpd2qk609asnkkfdecc',
]

/**
 * BIP 44 Addresses
 */

export const bitcoinValidMainnetBIP44Addresses = [
  '162hW2VPgvbEYCTMDnxnuavGqD4g2ZrRrG',
  '14R42MkhGmRBVwYvvMiTR6FUcsqqLyZBNH',
  '1EY9D9VurdKfHyc8shLejPeuGKnRgYcFqe',
  '1P2jBe7AyiSAHTGi3uei6nTPfKeUNDbcbg',
]
export const bitcoinInvalidMainnetBIP44Addresses = [
  '162hW2VPgvbEYCTMDnxnuavfqD4g2ZrRrG',
  '14R42MkhGmRBVwYvvMiTR6FfcsqqLyZBNH',
  '1EY9D9VurdKfHyc8shLejPefGKnRgYcFqe',
  '1P2jBe7AyiSAHTGi3uei6nTffKeUNDbcbg',
]

export const bitcoinValidTestnetBIP44Addresses = [
  'mhJiKEVV6PjVf7RwRUHjV82UtE3wDkY225',
  'mmarqyg7Zk6UTtEmdaxU5gjtew2hckp3Zb',
  'n2ZRypH2VUgZD3bZgXzoRTAeh71Kmq17GJ',
  'mwn2mWLNWZ9KyrMipdz9RqnRZLa9WaoShK',
]

export const bitcoinInvalidTestnetBIP44Addresses = [
  'mhJiKEVV6PjVf7RwRUHjV82UtE3wDDY225',
  'mmarqyg7Zk6UTtEmdaxU5gjtew2hccp3Zb',
  'n2ZRypH2VUgZD3bZgXzoRTAeh71KmA17GJ',
  'mwn2mWLNWZ9KyrMipdz9RqnRZLa9WDoShK',
]

export const addressesOrganized = {
  BIP44: {
    testnet: {
      valid: bitcoinValidTestnetBIP44Addresses,
      invalid: bitcoinInvalidTestnetBIP44Addresses,
    },
    mainnet: {
      valid: bitcoinValidMainnetBIP44Addresses,
      invalid: bitcoinInvalidMainnetBIP44Addresses,
    },
  },
  BIP84: {
    testnet: {
      valid: bitcoinValidTestnetBIP84Addresses,
      invalid: bitcoinInvalidTestnetBIP84Addresses,
    },
    mainnet: {
      valid: bitcoinValidMainnetBIP84Addresses,
      invalid: bitcoinInvalidMainnetBIP84Addresses,
    },
  },
}
