import React from 'react'
import Svg, { Rect, Polyline } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const CopyIcon: React.FC<SVGIconInterface> = ({
  width,
  height,
  color,
}) => (
  <Svg width={width || '25'} height={height || '25'} viewBox="0 0 25 25">
    <Rect
      x="11"
      y="10.3"
      width="5.2"
      height="6.4"
      stroke={color || '#252525'}
    />
    <Polyline points="14.4,8.5 9.3,8.5 9.3,14.5" stroke={color || '#252525'} />
  </Svg>
)
