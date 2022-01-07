import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const NewWalletIcon: React.FC<SVGIconInterface> = (props: SvgProps) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -10 22 45"
      width={width || 50}
      height={height || 50}
      fill={color || '#5D5E5E'}>
      <Path d="M0 0h24v24H0V0z" fill="none" />
      <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </Svg>
  )
}
