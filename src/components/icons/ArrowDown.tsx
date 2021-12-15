import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const ArrowDown: React.FC<SVGIconInterface> = ({
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
      d="M17.9,32.1V18.9l2.3,0l0,9.3l10.3-10.3l1.7,1.7L22,29.8l9.3,0l-0.1,2.3L17.9,32.1"
      fill={color || '#5D5E5E'}
    />
  </Svg>
)
