import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const ArrowUp: React.FC<SVGIconInterface> = ({
  width,
  height,
  color,
}) => (
  <Svg
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    width={width || '50'}
    height={height || '50'}>
    <Path
      d="M32.1,17.9v13.2l-2.3,0l0-9.3L19.6,32.1l-1.7-1.7L28,20.2l-9.3,0l0.1-2.3L32.1,17.9"
      fill={color || '#5D5E5E'}
    />
  </Svg>
)
