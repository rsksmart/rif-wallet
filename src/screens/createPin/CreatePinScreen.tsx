import { useCallback } from 'react'

import { navigationContainerRef } from 'core/Core'
import { PinManager } from 'components/PinManager'
import { useAppDispatch } from 'store/storeUtils'
import { setPinState } from 'store/slices/settingsSlice'
import { rootStackRouteNames } from 'navigation/rootNavigator'

export const CreatePinScreen = () => {
  const dispatch = useAppDispatch()

  const handleSubmit = useCallback((enteredPin: string) => {
    dispatch(setPinState(enteredPin))
    navigationContainerRef.navigate(rootStackRouteNames.Home)
  }, [])

  return <PinManager title={'Set your pin'} handleSubmit={handleSubmit} />
}
