export enum ChainTypeEnum {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

/**
 * Object that has chainTypes IDs
 */
export const chainTypes = {
  [ChainTypeEnum.MAINNET]: 30,
  [ChainTypeEnum.TESTNET]: 31,
}

export const chainTypesById = {
  30: ChainTypeEnum.MAINNET,
  31: ChainTypeEnum.TESTNET,
}

export type ChainTypesByIdType = keyof typeof chainTypesById
