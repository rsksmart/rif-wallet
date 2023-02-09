import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DomainRegistrationEnum, RnsProcessor } from 'lib/rns/RnsProcessor'

import { ProfileStatus } from 'navigation/profileNavigator/types'
import { ProfileStore } from './types'

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
      thunkAPI.dispatch(setAlias(`${alias}.rsk`))
      let indexStatus = rnsProcessor.getStatus(alias)
      if (!indexStatus?.commitmentRequested) {
        await rnsProcessor.process(alias, duration)
        thunkAPI.dispatch(setStatus(ProfileStatus.REQUESTING))
      }
      indexStatus = rnsProcessor.getStatus(alias)
      if (indexStatus.commitmentRequested) {
        const status = await commitment(rnsProcessor, alias)
        return status
      }
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

const initialState = {} as ProfileStore

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_state, action: PayloadAction<ProfileStore>) => action.payload,
    setAlias: (state, { payload }: PayloadAction<string>) => {
      state.alias = payload
    },
    setStatus: (state, { payload }: PayloadAction<ProfileStatus>) => {
      state.status = payload
    },
    recoverAlias: (
      state,
      { payload }: PayloadAction<Partial<ProfileStore>>,
    ) => {
      state.alias = payload.alias || ''
      state.status = payload.status || ProfileStatus.NONE
    },
    deleteProfile: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(requestUsername.fulfilled, state => {
      state.status = ProfileStatus.PURCHASE
    })
    builder.addCase(requestUsername.pending, state => {
      state.status = ProfileStatus.NONE
    })
    builder.addCase(requestUsername.rejected, state => {
      state.status = ProfileStatus.NONE
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

const commitment = (rnsProcessor: RnsProcessor, alias: string) => {
  return new Promise<ProfileStatus>(resolve => {
    const intervalId = setInterval(async () => {
      const canRevealResponse = await rnsProcessor.canReveal(alias)
      if (canRevealResponse === DomainRegistrationEnum.COMMITMENT_READY) {
        clearInterval(intervalId)
        return resolve(ProfileStatus.PURCHASE)
      }
    }, 1000)
  })
}

export const { setProfile, setStatus, setAlias, deleteProfile, recoverAlias } =
  profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
