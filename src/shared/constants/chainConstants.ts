export enum ChainTypeEnum {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}
/**
 * Object that has the ChainTypeEnum by ID
 */
export const chainTypesById = {
  30: ChainTypeEnum.MAINNET,
  31: ChainTypeEnum.TESTNET,
}
