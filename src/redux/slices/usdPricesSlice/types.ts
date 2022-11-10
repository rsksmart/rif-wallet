interface IUsdPrice {
  lastUpdated: string
  price: number
}
export interface IUsdPricesState {
  [id: string]: IUsdPrice
}
