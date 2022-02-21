import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const ShareIcon: React.FC<SVGIconInterface> = (props: SvgProps) => {
  const { width, height, color } = props
  return (
    <Svg width={width || 50} height={height || 50} fill={color || '#5D5E5E'}>
      <Path
        d="M6.9 8.491h-.8c-1.6-.1-3 1.2-3 2.8v6.9c.1 1.6 1.4 2.9 3.1 2.8h7.5c1.6.1 3-1.2 3.1-2.8v-6.9c-.1-1.6-1.4-2.9-3.1-2.8h-1"
        fill="none"
        stroke={color || '#dbe1f3'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeMiterlimit={10}
      />
      <Path
        opacity={0.211}
        d="M7.3 8.491H6.1c-1.6-.1-3 1.2-3 2.8v6.9c.1 1.6 1.4 2.9 3.1 2.8h7.5c1.6.1 3-1.2 3.1-2.8v-6.9c-.1-1.6-1.4-2.9-3.1-2.8h-1.4"
        fill="nofill"
      />
      <Path
        d="M6.754 5.652l3.2-2.9 3.1 2.9"
        fill="none"
        stroke={color || '#dbe1f3'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.854 3.052v10.6"
        fill="none"
        stroke={color || '#dbe1f3'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}
