import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const RegisterIcon: React.FC<SVGIconInterface> = (props: SvgProps) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -10 22 45"
      width={width || 50}
      height={height || 50}
      fill={color || '#5D5E5E'}>
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path d="M10 4h4v4h-4zM4 16h4v4H4zM4 10h4v4H4zM4 4h4v4H4zM16 4h4v4h-4zM11 17.86V20h2.1l5.98-5.97-2.12-2.12zM14 12.03V10h-4v4h2.03zM20.85 11.56l-1.41-1.41c-.2-.2-.51-.2-.71 0l-1.06 1.06 2.12 2.12 1.06-1.06c.2-.2.2-.51 0-.71z" />
    </Svg>
  )
}
