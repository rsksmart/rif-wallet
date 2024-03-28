import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import { sharedColors } from 'shared/constants'

interface Props extends SvgProps {
  color?: string
  backgroundColor?: string
}

export const UserIcon = ({
  width = 44,
  height = 46,
  color = sharedColors.text.label,
  backgroundColor = sharedColors.background.secondary,
  ...props
}: Props) => (
  <Svg width={width} height={height} viewBox="0 0 32 33" {...props}>
    <Rect width={width} height={height} fill={backgroundColor} />
    <Path
      fill={color}
      d="M17.3945 18.3125H14.6055C12.0078 18.3125 9.875 20.4453 9.875 23.043C9.875 23.5625 10.3125 24 10.832 24H21.168C21.6875 24 22.125 23.5625 22.125 23.043C22.125 20.4453 19.9922 18.3125 17.3945 18.3125ZM11.2148 22.6875C11.3789 20.9648 12.8555 19.625 14.6055 19.625H17.3945C19.1445 19.625 20.6211 20.9648 20.7852 22.6875H11.2148ZM16 17C17.9414 17 19.5 15.4414 19.5 13.5C19.5 11.5586 17.9414 10 16 10C14.0586 10 12.5 11.5586 12.5 13.5C12.5 15.4414 14.0586 17 16 17ZM16 11.3125C17.2031 11.3125 18.1875 12.2969 18.1875 13.5C18.1875 14.7031 17.2031 15.6875 16 15.6875C14.7969 15.6875 13.8125 14.7031 13.8125 13.5C13.8125 12.2969 14.7969 11.3125 16 11.3125Z"
    />
  </Svg>
)

export default UserIcon
