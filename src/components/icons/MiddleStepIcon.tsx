import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

export const MiddleStepIcon = ({
  width = 18,
  height = 7,
  color = 'white',
  ...props
}: SVGIconInterface) => (
  <Svg viewBox="0 0 18 7" width={width} height={height} fill="none" {...props}>
    <Path
      d="M18.0068 6.625L0.44586 6.625L0.44586 0.625L18.0068 0.625003L18.0068 6.625Z"
      fill={color}
    />
  </Svg>
)
