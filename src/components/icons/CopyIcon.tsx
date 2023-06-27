import Svg, { Path } from 'react-native-svg'

import { SVGIconInterface } from './index'

export const CopyIcon = ({
  width,
  height,
  color,
  viewBox = undefined,
}: SVGIconInterface & { viewBox?: string }) => (
  <Svg width={width || '25'} height={height || '25'} viewBox={viewBox}>
    <Path
      d="M7.8 3.1H7C5.4 3 4 4.3 4 5.9v6.9c0 1.6 1.4 2.9 3 2.8h7.5c1.6.1 3-1.2 3.1-2.8V5.9c-.1-1.6-1.4-2.9-3.1-2.8H7.8"
      transform="translate(-244.719 -550.704) translate(244.719 550.704)"
      fill="none"
      stroke={color || '#dbe1f3'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeMiterlimit={10}
    />
    <Path
      d="M7.8 3.1H7C5.4 3 4 4.3 4 5.9v6.9c0 1.6 1.4 2.9 3 2.8h7.5c1.6.1 3-1.2 3.1-2.8V5.9c-.1-1.6-1.4-2.9-3.1-2.8H7.8"
      transform="translate(-244.719 -550.704) translate(248.719 554.525)"
      fill="none"
      stroke={color || '#dbe1f3'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeMiterlimit={10}
    />
  </Svg>
)
