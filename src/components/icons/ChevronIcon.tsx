import Svg, { SvgProps, Path } from 'react-native-svg'

const ChevronIcon = ({ width = 24, height = 24, ...props }: SvgProps) => (
  <Svg height={height} width={width} {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill={props.color}
      d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
    />
  </Svg>
)

export default ChevronIcon
