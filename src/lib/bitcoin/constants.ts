// COINS

export const NETWORK_ID = {
  BITCOIN: 'BITCOIN',
  BITCOIN_TESTNET: 'BITCOIN_TESTNET',
}

// Coin VALUE

export const NETWORK_DATA = {
  [NETWORK_ID.BITCOIN]: {
    coinTypeNumber: 0,
    networkName: 'BITCOIN',
    disabled: true,
    symbol: 'BTC',
  },
  [NETWORK_ID.BITCOIN_TESTNET]: {
    coinTypeNumber: 1,
    networkName: 'BITCOIN TESTNET',
    disabled: false,
    symbol: 'BTCT',
  },
}

// BIPs

export const BIP_ID = {
  BIP44: 'BIP44',
  BIP84: 'BIP84',
}

// BIPs data

export const BIP_DATA = {
  [BIP_ID.BIP44]: {
    number: 44,
    name: 'BIP44',
  },
  [BIP_ID.BIP84]: {
    number: 84,
    name: 'Native SegWit',
  },
}
// Coins BIPs current supported implementation OR Network Names current supported implementation

export const COIN_BIPS = {
  [NETWORK_ID.BITCOIN]: {
    [BIP_ID.BIP44]: {
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
      },
      wif: 0xef,
      bech32: '1',
    },
    [BIP_ID.BIP84]: {
      bip32: {
        public: 0x04b24746,
        private: 0x04b2430c,
      },
      wif: 0xef,
      bech32: 'bc',
    },
  },
  [NETWORK_ID.BITCOIN_TESTNET]: {
    [BIP_ID.BIP44]: {
      bip32: {
        public: 0x043587cf,
        private: 0x04358394,
      },
      wif: 0xef,
      bech32: 'm',
    },
    [BIP_ID.BIP84]: {
      bip32: {
        public: 0x045f1cf6,
        private: 0x045f18bc,
      },
      wif: 0xef,
      bech32: 'tb',
    },
  },
}
