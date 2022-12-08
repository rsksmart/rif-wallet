import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState, AppDispatch, AsyncThunkWithTypes } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const createAppAsyncThunk =
  createAsyncThunk.withTypes<AsyncThunkWithTypes>()
