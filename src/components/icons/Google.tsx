import { ColorValue } from 'react-native'
import Svg, { Rect, G, Path, Defs, ClipPath, SvgProps } from 'react-native-svg'

import { sharedColors } from 'shared/constants'

export interface SocialSvgProps extends SvgProps {
  logoColor?: ColorValue
}

export const Google = ({
  height = 81,
  width = 108,
  color = sharedColors.white,
  logoColor = '#272727',
  ...props
}: SocialSvgProps) => {
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
        width={Number(width) - 1}
        height={Number(height) - 1}
        rx={10}
        fill={color}
      />
      <G clipPath="url(#clip0_602_3581)">
        <Path
          d="M64.118 29.482c-.11.102-.219.195-.32.296-1.252 1.231-2.505 2.462-3.752 3.699-.104.103-.16.095-.264.001-1.478-1.326-3.214-2.006-5.185-2.102-4.012-.195-7.524 2.371-8.828 6.055a8.97 8.97 0 00-.538 2.987c-.004 2.307.72 4.369 2.199 6.135 1.39 1.66 3.153 2.714 5.285 3.05 2.378.375 4.633.001 6.651-1.398 1.218-.844 2.085-1.99 2.615-3.38.162-.424.245-.879.362-1.32.009-.031.005-.066.008-.117-.075-.004-.144-.012-.213-.012h-7.726c-.15 0-.226-.076-.226-.229 0-1.73 0-3.46-.003-5.191 0-.107.036-.137.132-.129.066.005.133.001.2.001h13.373c.237 0 .218-.037.274.225.224 1.038.27 2.09.255 3.148-.036 2.385-.508 4.669-1.554 6.818a13.189 13.189 0 01-2.783 3.807c-2.044 1.948-4.49 3.052-7.242 3.496-2.544.41-5.054.265-7.494-.605-3.75-1.337-6.548-3.8-8.388-7.356a14.565 14.565 0 01-1.455-4.533 15.001 15.001 0 01-.081-3.918 14.641 14.641 0 011.432-4.956c1.961-3.94 5.043-6.563 9.232-7.806 3.005-.892 6.014-.789 8.983.228 1.863.638 3.502 1.663 4.954 2.998.028.025.05.055.097.108z"
          fill={logoColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_602_3581">
          <Path
            fill={color}
            transform="translate(39.33 25.541)"
            d="M0 0H29.0909V30H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
