import React from 'react'
import Svg, { Rect, Polyline, Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const ImportWalletIcon: React.FC<SVGIconInterface> = (
  props: SvgProps,
) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -6 22 45"
      width={width || 50}
      height={height || 50}
      fill={color || '#5D5E5E'}>
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" />
    </Svg>
  )
}
