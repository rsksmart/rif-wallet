import { AppDispatch } from 'store/store'
import { deleteContacts } from 'store/slices/contactsSlice'
import { resetKeysAndPin } from 'store/slices/settingsSlice'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { resetMainStorage } from 'storage/MainStorage'

export const resetReduxAndStoraState = (dispatch: AppDispatch) => {
  dispatch(deleteContacts())
  dispatch(resetKeysAndPin())
  dispatch(resetSocketState())
  resetMainStorage()
}
