import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DomainRegistrationEnum, RnsProcessor } from 'lib/rns/RnsProcessor'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { IProfileStore } from './types'

const initialState = {
  status: ProfileStatus.NONE,
} as IProfileStore

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_state, action: PayloadAction<IProfileStore>) =>
      action.payload,
    setAlias: (state, { payload }: PayloadAction<string>) => {
      state.alias = payload
    },
    deleteProfile: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(requestUsername.fulfilled, state => {
      state.status = ProfileStatus.PURCHASE
    })
    builder.addCase(requestUsername.pending, state => {
      state.status = ProfileStatus.REQUESTING
    })
    builder.addCase(requestUsername.rejected, state => {
      state.status = ProfileStatus.NONE
      state.alias = ''
    })
    builder.addCase(purchaseUsername.fulfilled, state => {
      state.status = ProfileStatus.USER
    })
    builder.addCase(purchaseUsername.pending, state => {
      state.status = ProfileStatus.PURCHASING
    })
    builder.addCase(purchaseUsername.rejected, state => {
      state.status = ProfileStatus.PURCHASE
    })
  },
})

export const requestUsername = createAsyncThunk(
  'profile/requestUsername',
  async (
    {
      rnsProcessor,
      alias,
      duration,
    }: { rnsProcessor: RnsProcessor; alias: string; duration: number },
    thunkAPI,
  ) => {
    try {
      return new Promise<void>(async resolve => {
        thunkAPI.dispatch(setAlias(`${alias}.rsk`))
        let indexStatus = rnsProcessor.getStatus(alias)
        if (!indexStatus?.commitmentRequested) {
          await rnsProcessor.process(alias, duration)
        }
        indexStatus = rnsProcessor.getStatus(alias)
        if (indexStatus.commitmentRequested) {
          const intervalId = setInterval(async () => {
            const canRevealResponse = await rnsProcessor.canReveal(alias)
            if (canRevealResponse === DomainRegistrationEnum.COMMITMENT_READY) {
              clearInterval(intervalId)
              return resolve()
            }
          }, 1000)
        }
      })
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const purchaseUsername = createAsyncThunk(
  'profile/purchaseUsername',
  async (
    { rnsProcessor, domain }: { rnsProcessor: RnsProcessor; domain: string },
    thunkAPI,
  ) => {
    try {
      const response = await rnsProcessor.register(domain)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const { setProfile, setAlias, deleteProfile } = profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
