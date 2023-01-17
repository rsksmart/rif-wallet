import { AppDispatch } from 'store/store'
export { store, RootState, createStore } from './store'

export { Provider } from 'react-redux'
export { Dispatch } from 'redux'
import { deleteContacts } from 'store/slices/contactsSlice'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { resetKeysAndPin } from 'store/slices/settingsSlice'

export const resetReduxStates = (dispatch: AppDispatch) => {
  dispatch(deleteContacts())
  dispatch(resetKeysAndPin())
  dispatch(resetSocketState())
}
