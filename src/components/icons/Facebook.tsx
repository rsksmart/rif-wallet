import { ColorValue } from 'react-native'
import Svg, { Rect, Path, SvgProps } from 'react-native-svg'

import { sharedColors } from 'shared/constants'

interface Props extends SvgProps {
  logoColor?: ColorValue
}

export const Facebook = ({
  height = 81,
  width = 108,
  color = sharedColors.white,
  logoColor = sharedColors.black,
  ...props
}: Props) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...props}>
      <Rect
        x={0.375}
        y={0.541016}
        width={105}
        height={80}
        rx={10}
        fill={color}
      />
      <Path
        d="M55.249 56.041h-5.6c-.383-.152-.502-.439-.5-.838.008-4.086.004-8.173.004-12.26v-.398h-3.879c-.606-.001-.819-.213-.82-.823-.001-1.574-.002-3.148 0-4.722.002-.598.225-.814.834-.814l3.531-.001c.106 0 .213-.01.334-.015 0-1.134.005-2.233-.001-3.332-.006-1.098.123-2.174.497-3.211.549-1.525 1.488-2.737 2.906-3.562 1.28-.745 2.676-1.018 4.139-1.022 1.258-.004 2.516 0 3.773.002.602.001.827.223.828.822.003 1.221.002 2.442 0 3.663 0 .303.009.606-.01.907-.023.357-.248.57-.605.598-.142.012-.285.004-.426.006-.964.013-1.929-.006-2.89.05-1.083.062-1.604.632-1.625 1.718-.019.978-.01 1.957-.012 2.936v.44H60.29c.585.002.812.226.813.805.002 1.584 0 3.168-.001 4.752-.001.587-.218.802-.809.803H55.727v.44c0 4.055-.003 8.112.003 12.168.001.397-.098.71-.482.887l.001.001z"
        fill={logoColor}
      />
    </Svg>
  )
}
