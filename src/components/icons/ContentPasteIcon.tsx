import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const ContentPasteIcon: React.FC<SVGIconInterface> = (
  props: SvgProps,
) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -12 24 47"
      width={width || 30}
      height={height || 43}
      fill={color || '#5D5E5E'}>
      <Path fill="none" d="M0 0h24v24H0V0z" />
      <Path d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" />
    </Svg>
  )
}
