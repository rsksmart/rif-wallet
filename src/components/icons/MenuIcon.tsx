import * as React from 'react'
import Svg, { Line } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const MenuIcon: React.FC<SVGIconInterface> = ({
  width,
  height,
  color,
}) => (
  <Svg
    width={width || '18.727'}
    height={height || 18.735}
    viewBox="0 0 18.727 18.735">
    <Line
      x1="0"
      y1="0.5"
      x2="17"
      y2="0.5"
      stroke={color || '#707070'}
      strokeWidth="2"
    />
    <Line
      x1="0"
      y1="12.5"
      x2="17"
      y2="12.5"
      stroke={color || '#707070'}
      strokeWidth="2"
    />
    <Line
      x1="0"
      y1="6.5"
      x2="17"
      y2="6.5"
      stroke={color || '#707070'}
      strokeWidth="2"
    />
  </Svg>
)
