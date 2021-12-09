import * as React from 'react'
import Svg, { Circle, Rect, Polyline } from 'react-native-svg'

export default () => (
  <Svg width="25" height="25" viewBox="0 0 25 25">
    <Circle cx="12.8" cy="12.6" r="12.2" fill="#d5d5d5" />
    <Rect x="11" y="10.3" width="5.2" height="6.4" stroke="#252525" />
    <Polyline points="14.4,8.5 9.3,8.5 9.3,14.5" stroke="#252525" />
  </Svg>
)
