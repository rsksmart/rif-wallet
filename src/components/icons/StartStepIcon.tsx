import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const StartStepIcon = ({
  width = 18,
  height = 7,
  color = 'white',
  ...props
}: SVGIconInterface) => (
  <Svg viewBox="0 0 18 7" width={width} height={height} fill="none" {...props}>
    <Path
      d="M0.00683594 3.625C0.00683594 1.96814 1.34998 0.625 3.00683 0.625H17.5678V6.625H3.00683C1.34998 6.625 0.00683594 5.28185 0.00683594 3.625V3.625Z"
      fill={color}
    />
  </Svg>
)
