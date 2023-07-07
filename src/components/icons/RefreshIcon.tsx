import Svg, { Path } from 'react-native-svg'

import { SVGIconInterface } from './index'

export const RefreshIcon = ({ width, height, color }: SVGIconInterface) => (
  <Svg viewBox="0 0 50 50" width={width || '50'} height={height || '50'}>
    <Path
      d="M25,12.8c-2.9,0-5.7,1.1-7.7,2.8c-0.4,0.4-0.5,1-0.1,1.4c0.4,0.4,1,0.5,1.4,0.1c0,0,0,0,0,0 c1.7-1.5,4-2.4,6.5-2.4c5.2,0,9.5,3.9,10,9h-3l4,6l4-6h-3.1C36.4,17.6,31.3,12.8,25,12.8z M14.3,18.8l-4,6H13c0,6.6,5.4,12,12,12 c2.9,0,5.7-1.1,7.7-2.8c0.4-0.4,0.5-1,0.1-1.4c-0.4-0.4-1-0.5-1.4-0.1c0,0,0,0,0,0c-1.7,1.5-4,2.4-6.5,2.4c-5.6,0-10-4.4-10-10h3.3 L14.3,18.8z"
      fill={color || '#CCCCCC'}
    />
  </Svg>
)
