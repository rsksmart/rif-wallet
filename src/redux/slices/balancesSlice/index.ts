import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'
import { BitcoinNetworkWithBIPRequest } from '@rsksmart/rif-wallet-bitcoin'
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
  if ('satoshis' in token) {
    const balanceBigNumber = BigNumber.from(
      Math.round(Number(token.balance) * 10e8),
    )

    return {
      balance: balanceToDisplay(balanceBigNumber.toString(), 8, 4),
      usdBalance: convertBalance(balanceBigNumber, 8, price).toString(),
    }
  } else {
    return {
      balance: balanceToDisplay(token.balance, token.decimals, 4),
      usdBalance: convertBalance(
        token.balance,
        token.decimals,
        price,
      ).toString(),
    }
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
        usdPrices[b.contractAddress].price,
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

    const totalUsdValue = balances
      .reduce((previousValue, token) => {
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

    thunkAPI.dispatch(addOrUpdateBalancesState(balances))
    thunkAPI.dispatch(setTotalUsdBalance(totalUsdValue))
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
