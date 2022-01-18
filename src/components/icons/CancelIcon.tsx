import React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const CancelIcon = (props: SvgProps) => (
  <Svg height={24} width={24} {...props}>
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={props.color}
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
  </Svg>
)
