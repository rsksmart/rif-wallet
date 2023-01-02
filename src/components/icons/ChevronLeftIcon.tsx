import Svg, { SvgProps, Path } from 'react-native-svg'

export const ChevronLeftIcon = ({
  width = 24,
  height = 24,
  color = 'white',
  ...props
}: SvgProps) => (
  <Svg height={height} width={width} viewBox="0 0 511.641 511.641" {...props}>
    <Path
      d="M148.32 255.76L386.08 18c4.053-4.267 3.947-10.987-.213-15.04a10.763 10.763 0 00-14.827 0L125.707 248.293a10.623 10.623 0 000 15.04L371.04 508.667c4.267 4.053 10.987 3.947 15.04-.213a10.763 10.763 0 000-14.827L148.32 255.76z"
      fill={color}
    />
  </Svg>
)
