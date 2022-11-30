import { pinLength } from '../../shared/costants'
import { PinContainer } from './PinContainer'
import PinScreen from './PinScreen'
import MessageComponent from './PinScreen/MessageComponent'
import { PinScreenType } from './PinScreen/PinScreen'

interface PinManagerProps {
  title: string
  handleSubmit: (enteredPin: string) => void
}

const PinManagerView = ({
  title,
  ...props
}: PinScreenType & { title: string | undefined }) => {
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
export const PinManager = ({ title, handleSubmit }: PinManagerProps) => {
  return (
    <PinContainer
      pinLength={pinLength}
      onPinSubmit={handleSubmit}
      PinScreenComponent={props => <PinManagerView title={title} {...props} />}
    />
  )
}
