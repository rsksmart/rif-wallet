import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

export const useKeyboardIsVisible = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsVisible(true),
    )

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsVisible(false),
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return isVisible
}
