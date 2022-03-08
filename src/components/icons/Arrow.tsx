import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface local {
  rotate?: number
  color: string
  width?: number
  height?: number
}

export const Arrow: React.FC<local> = ({ color, rotate, width, height }) => {
  const w = width ? width : 50
  const h = height ? height : 50
  return (
    <Svg width={w} height={h} viewBox="0 0 50 50">
      <Path
        d="M25.2,16.5l8.2,8.2L31.9,26l-5.7-5.7v12.8H24V20.5l-5.7,5.8l-1.4-1.5L25.2,16.5"
        fill={color || '#000000'}
        transform={`rotate(${rotate || '0'}, 25, 25)`}
      />
    </Svg>
  )
}
