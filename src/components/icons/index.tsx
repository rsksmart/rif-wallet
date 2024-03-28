import { StyleProp, TextProps, TextStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

export interface SVGIconInterface {
  width?: number
  height?: number
  color?: string
  style?: StyleProp<TextStyle>
}

export interface MaterialIconInterface extends TextProps {
  color?: string
  size?: number
}

export interface FooterIconInterface extends SvgProps {
  active?: boolean
  activeColor?: string
}

export { Arrow } from './Arrow'
export { CompassIcon } from './CompassIcon'
export { ContactsIcon } from './ContactsIcon'
export { CopyIcon } from './CopyIcon'
export { FrownFaceIcon } from './FrownIcon'
export { RefreshIcon } from './RefreshIcon'
export { SmileFaceIcon } from './SmileIcon'
export { WalletIcon } from './WalletIcon'
export { QRCodeIcon } from './QRCodeIcon'
export { ImportWalletIcon } from './ImportWalletIcon'
export { NewWalletIcon } from './NewWalletIcon'
export { ContentPasteIcon } from './ContentPasteIcon'
export { ShareIcon } from './ShareIcon'
export { default as ReceiveIcon } from './ReceiveIcon'
export { HideShowIcon } from './HideShowIcon'
export { EditMaterialIcon } from './EditMaterialIcon'
export { DeleteIcon } from './DeleteIcon'
