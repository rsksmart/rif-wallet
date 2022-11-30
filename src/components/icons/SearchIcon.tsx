import Svg, { Path, SvgProps } from 'react-native-svg'
import { SVGIconInterface } from './index'

export const SearchIcon = (props: SvgProps & SVGIconInterface) => {
  const { width, height, color } = props
  return (
    <Svg
      viewBox="0 -10 22 45"
      width={width || 50}
      height={height || 50}
      fill={color || '#5D5E5E'}>
      <Path d="M0 0h24v24H0V0z" fill="none" />
      <Path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </Svg>
  )
}
