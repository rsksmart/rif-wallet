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
      let indexStatus = rnsProcessor.getStatus(alias)
      if (!indexStatus?.commitmentRequested) {
        await rnsProcessor.process(alias, duration)
        thunkAPI.dispatch(setStatus(ProfileStatus.REQUESTING))
        thunkAPI.dispatch(setAlias(`${alias}.rsk`))
        thunkAPI.dispatch(setDuration(duration))
      }
      indexStatus = rnsProcessor.getStatus(alias)
      if (indexStatus.commitmentRequested) {
        return await commitment(rnsProcessor, alias)
      }
      return null
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

const initialState: ProfileStore = {
  alias: '',
  phone: '',
  email: '',
  status: ProfileStatus.NONE,
  infoBoxClosed: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_, action: PayloadAction<ProfileStore>) => action.payload,
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
    setDuration: (state, { payload }: PayloadAction<number>) => {
      state.duration = payload
    },
    deleteProfile: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(requestUsername.fulfilled, state => {
      state.status = ProfileStatus.READY_TO_PURCHASE
    })
    builder.addCase(requestUsername.pending, state => {
      state.status = ProfileStatus.REQUESTING
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
      state.status = ProfileStatus.READY_TO_PURCHASE
    })
  },
})

const commitment = (
  rnsProcessor: RnsProcessor,
  alias: string,
): Promise<ProfileStatus> => {
  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      rnsProcessor.canReveal(alias).then(canRevealResponse => {
        if (canRevealResponse === DomainRegistrationEnum.COMMITMENT_READY) {
          clearInterval(intervalId)
          resolve(ProfileStatus.READY_TO_PURCHASE)
        }
      })
    }, 1000)
  })
}

export const {
  setProfile,
  setStatus,
  setAlias,
  deleteProfile,
  recoverAlias,
  setDuration,
} = profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
