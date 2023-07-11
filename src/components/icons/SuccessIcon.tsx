import Svg, { Path, SvgProps } from 'react-native-svg'

export const SuccessIcon = (props: SvgProps) => (
  <Svg width={205} height={205} fill="none" {...props}>
    <Path
      stroke="#11B55C"
      strokeWidth={16}
      d="M23.629 97.138c0-43.63 35.37-79 79-79s79 35.37 79 79c0 43.631-35.37 79-79 79s-79-35.369-79-79Z"
    />
    <Path
      stroke="#11B55C"
      strokeWidth={13}
      d="m74.95 96.309 19.005 19.005 36.352-36.352"
    />
  </Svg>
)
