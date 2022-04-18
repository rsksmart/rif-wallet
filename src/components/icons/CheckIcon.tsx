import React from 'react'
import Svg, { Path } from 'react-native-svg'
interface local {
  rotate?: number
  color: string
  width?: number
  height?: number
}
export const CheckIcon: React.FC<local> = ({ color, width, height }) => {
  const w = width ? width : 50
  const h = height ? height : 50
  return (
    <Svg width={w} height={h} viewBox="0 -10 25 45">
      <Path d="M0 0h24v24H0V0z" fill="none" />
      <Path
        d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
        fill={color || '#000000'}
        transform={`rotate(${'0'}, 25, 25)`}
      />
    </Svg>
  )
}
