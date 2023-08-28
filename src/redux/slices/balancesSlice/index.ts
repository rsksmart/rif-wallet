import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BitcoinNetworkWithBIPRequest,
  convertBtcToSatoshi,
} from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import { balanceToDisplay, convertBalance } from 'lib/utils'

import {
  BalanceState,
  ITokenWithoutLogo,
  TokenBalanceObject,
} from 'store/slices/balancesSlice/types'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AsyncThunkWithTypes } from 'store/store'

export const getBalance = (
  token: ITokenWithBalance | BitcoinNetworkWithBIPRequest,
  price: number,
) => {
  let tokenBalance = token.balance.toString()
  if ('satoshis' in token) {
    tokenBalance = convertBtcToSatoshi(tokenBalance).toString()
  }

  let balance = balanceToDisplay(tokenBalance, token.decimals, 4)
  if (Number(balance) === 0) {
    balance = balanceToDisplay(tokenBalance, token.decimals, 6)
  }
  if (Number(balance) === 0) {
    balance = balanceToDisplay(tokenBalance, token.decimals, 8)
  }

  return {
    balance,
    usdBalance: convertBalance(tokenBalance, token.decimals, price),
  }
}

export const addOrUpdateBalances = createAsyncThunk<
  void,
  ITokenWithBalance[],
  AsyncThunkWithTypes
>('balances/addOrUpdateBalancesThunk', async (payload, thunkAPI) => {
  try {
    const { usdPrices, settings } = thunkAPI.getState()
    const bitcoin = settings.bitcoin
    const balances: TokenBalanceObject[] = payload.map(b => {
      const { balance, usdBalance } = getBalance(
        b,
        usdPrices[b.contractAddress]?.price ?? 0,
      )
      return {
        ...b,
        balance,
        usdBalance,
      }
    })
    if (bitcoin) {
      // add bitcoin balance to balances state
      const bitBalances: TokenBalanceObject[] = bitcoin.networksArr.map(b => {
        const { balance, usdBalance } = getBalance(b, usdPrices.BTC.price)
        return {
          name: b.networkName,
          contractAddress: b.contractAddress,
          balance,
          usdBalance,
          decimals: b.decimals,
          symbol: b.symbol,
          satoshis: b.satoshis,
          bips: b.bips,
        }
      })
      balances.push(...bitBalances)
    }

    thunkAPI.dispatch(addOrUpdateBalancesState(balances))
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
      payload.forEach(token => {
        state.tokenBalances[token.contractAddress] = {
          ...token,
        }
      })
      state.totalUsdBalance = Object.values(state.tokenBalances)
        .reduce((previousValue, token) => {
          previousValue += token.usdBalance

          return previousValue
        }, 0)
        .toFixed(2)
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
    builder.addCase(addOrUpdateBalances.pending, state => {
      state.loading = true
    })
    builder.addCase(addOrUpdateBalances.rejected, state => {
      state.loading = false
    })
    builder.addCase(addOrUpdateBalances.fulfilled, state => {
      state.loading = false
    })
  },
})

export const { addOrUpdateBalancesState, setTotalUsdBalance } =
  balancesSlice.actions
export const balancesReducer = balancesSlice.reducer

export * from './selectors'
