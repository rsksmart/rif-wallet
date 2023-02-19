import Svg, { Path } from 'react-native-svg'
import { SVGIconInterface } from '.'

const EndStepIcon = ({ width, height, color = 'white' }: SVGIconInterface) => (
  <Svg viewBox="0 0 18 7" width={width || 18} height={height || 7} fill="none">
    <Path
      d="M18.0068 3.625C18.0068 5.28186 16.6637 6.625 15.0068 6.625L0.44586 6.625L0.44586 0.625L15.0068 0.625003C16.6637 0.625003 18.0068 1.96815 18.0068 3.625V3.625Z"
      fill={color}
    />
  </Svg>
)

export default EndStepIcon
