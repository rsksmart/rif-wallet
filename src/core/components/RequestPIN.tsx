import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resetReduxStates } from 'src/redux'

import { getPin } from 'storage/MainStorage'
import { PinContainer } from 'components/PinManager/PinContainer'
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { pinLength } from 'shared/costants'
import { useAppDispatch } from 'store/storeUtils'
import { resetKeysAndPin, unlockApp } from 'store/slices/settingsSlice'

export const RequestPIN = () => {
  const storedPin = useMemo(() => getPin(), [])
  const { t } = useTranslation
  const dispatch = useAppDispatch()
  const [resetEnabled, setResetEnabled] = useState<boolean>(false)

  const setGlobalError = useSetGlobalError()

  const onScreenUnlock = useCallback(async () => {
    try {
      await dispatch(unlockApp())
    } catch (err) {
      setGlobalError(err instanceof Error ? err.toString() : t('err_unknown'))
    }
  }, [dispatch, setGlobalError, t])

  const checkPin = useCallback(
    (enteredPin: string) => {
      try {
        if (storedPin === enteredPin) {
          onScreenUnlock()
        } else {
          setResetEnabled(true)
          throw new Error('Pin do not match.')
        }
      } catch (err) {}
    },
    [onScreenUnlock, storedPin],
  )

  return (
    <PinContainer
      pinLength={pinLength}
      key={pinLength}
      onPinSubmit={checkPin}
      resetEnabled={resetEnabled}
      resetKeysAndPin={() => resetReduxStates(dispatch)}
    />
  )
}
