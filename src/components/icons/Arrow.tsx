import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface local {
  rotate?: number
  color: string
}

export const Arrow: React.FC<local> = ({ color, rotate }) => {
  return (
    <Svg width="50" height="50" viewBox="0 0 50 50">
      <Path
        d="M25.2,16.5l8.2,8.2L31.9,26l-5.7-5.7v12.8H24V20.5l-5.7,5.8l-1.4-1.5L25.2,16.5"
        fill={color || '#000000'}
        transform={`rotate(${rotate || '0'}, 25, 25)`}
      />
    </Svg>
  )
}
