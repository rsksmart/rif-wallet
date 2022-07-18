import React from 'react'
import PinContainer from './PinContainer'
import PinScreen from './PinScreen'
import MessageComponent from './PinScreen/MessageComponent'
import { PinScreenType } from './PinScreen/PinScreen'

interface Interface {
  title: string
  handleSubmit: (enteredPin: string) => Promise<void> | any
}

const PinManagerView: React.FC<PinScreenType & { title: string | undefined }> =
  ({ title, ...props }) => {
    return (
      <PinScreen
        {...props}
        MessageComponent={() => (
          <MessageComponent
            message={title}
            ViewProps={{ testID: 'messageComponentView' }}
            TextProps={{ testID: 'messageTextComponent' }}
          />
        )}
      />
    )
  }
export const PinManager: React.FC<Interface> = ({ title, handleSubmit }) => {
  return (
    <PinContainer
      pinLength={4}
      onPinSubmit={handleSubmit}
      PinScreenComponent={props => <PinManagerView title={title} {...props} />}
    />
  )
}
