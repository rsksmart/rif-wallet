import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

const DiscoverTuneIcon: React.FC<SVGIconInterface> = ({
  width,
  height,
  color = 'white',
}) => (
  <Svg viewBox="0 0 50 50" width={width || 24} height={height || 24}>
    <Path
      d="M26 18.5v-3h6.5V6h3v9.5H42v3ZM32.5 42V21.5h3V42Zm-20 0v-9H6v-3h16v3h-6.5v9Zm0-15V6h3v21Z"
      fill={color}
    />
  </Svg>
)

export default DiscoverTuneIcon
