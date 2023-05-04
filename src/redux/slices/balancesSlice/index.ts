import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'

import { balanceToDisplay, convertBalance } from 'lib/utils'

import {
  BalanceState,
  ITokenWithoutLogo,
  TokenBalanceObject,
} from 'store/slices/balancesSlice/types'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AsyncThunkWithTypes } from 'store/store'

export const getBalance = (token: TokenBalanceObject) => {
  if ('satoshis' in token) {
    const balanceBigNumber = BigNumber.from(
      Math.round(Number(token.balance) * 10e8),
    )

    return balanceToDisplay(balanceBigNumber.toString(), 8, 4)
  } else {
    const tokenBalance: ITokenWithoutLogo = token
    return balanceToDisplay(tokenBalance.balance, tokenBalance.decimals, 4)
  }
}

export const addOrUpdateBalances = createAsyncThunk<
  void,
  ITokenWithoutLogo[],
  AsyncThunkWithTypes
>('balances/addOrUpdateBalancesThunk', async (payload, thunkAPI) => {
  try {
    const { usdPrices, settings } = thunkAPI.getState()
    const bitcoin = settings.bitcoin
    if (bitcoin) {
      // add bitcoin balance to balances state
      const bitBalances: TokenBalanceObject[] = bitcoin.networksArr.map(b => ({
        name: b.networkName,
        contractAddress: b.contractAddress,
        balance: b.balance.toString(),
        decimals: b.decimals,
        symbol: b.symbol,
        satoshis: b.satoshis,
      }))
      thunkAPI.dispatch(addOrUpdateBalancesState(bitBalances))

      const totalUsdValue = [...payload, ...bitBalances]
        .reduce((previousValue, token) => {
          console.log('TOKEN', token)
          if ('satoshis' in token) {
            previousValue += Number(token.balance) * usdPrices.BTC.price
          } else {
            previousValue += convertBalance(
              token.balance,
              token.decimals,
              usdPrices[token.contractAddress].price,
            )
          }
          return previousValue
        }, 0)
        .toFixed(2)

      console.log('TOTAL USD VALUE', totalUsdValue)

      thunkAPI.dispatch(setTotalUsdBalance(totalUsdValue))
    }
  } catch (err) {
    thunkAPI.rejectWithValue(err)
  }
})

const initialState: BalanceState = {
  tokenBalances: {},
  totalUsdBalance: '0',
  loading: false,
}

export const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    setTotalUsdBalance: (state, { payload }: PayloadAction<string>) => {
      state.totalUsdBalance = payload
    },
    addOrUpdateBalancesState: (
      state,
      { payload }: PayloadAction<ITokenWithoutLogo[]>,
    ) => {
      payload.map(token => {
        state.tokenBalances[token.contractAddress] = {
          ...token,
          balance: getBalance(token),
        }
      })
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
    builder.addCase(addOrUpdateBalances.pending, state => {
      state.loading = true
    }),
      builder.addCase(addOrUpdateBalances.rejected, state => {
        state.loading = false
      }),
      builder.addCase(addOrUpdateBalances.fulfilled, state => {
        state.loading = false
      })
  },
})

export const { addOrUpdateBalancesState, setTotalUsdBalance } =
  balancesSlice.actions
export const balancesReducer = balancesSlice.reducer

export * from './selectors'
