import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const CarotDownIcon: React.FC<SVGIconInterface> = ({
  width,
  height,
  color,
}) => (
  <Svg
    width={width || 6.143}
    height={height || 4.091}
    viewBox="0 0 6.143 4.091">
    <Path d="M3.073,4.07,0,0,6.143.046Z" fill={color || '#FFFFFF'} />
  </Svg>
)

export default CarotDownIcon
