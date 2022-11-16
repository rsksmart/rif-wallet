import Svg, { SvgProps, Path } from 'react-native-svg'

const PlusIcon = (props: SvgProps) => (
  <Svg height={24} width={24} {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill={props.color}
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
    />
  </Svg>
)

export default PlusIcon
