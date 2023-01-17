interface UsdPrice {
  lastUpdated: string
  price: number
}
export interface UsdPricesState {
  [id: string]: UsdPrice
}
