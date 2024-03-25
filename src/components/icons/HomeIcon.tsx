import Svg, { Path, Rect } from 'react-native-svg'

import { sharedColors } from 'shared/constants'

import { FooterIconInterface } from '.'

const HomeIcon = ({
  active = false,
  activeColor = sharedColors.primary,
  ...props
}: FooterIconInterface) => (
  <Svg width={52} height={52} fill="none" {...props}>
    {active && <Rect width={52} height={52} fill={activeColor} rx={26} />}
    <Path
      fill={sharedColors.text.primary}
      d="m37.389 24.336-10.105-8.303a2.297 2.297 0 0 0-2.943 0l-10.105 8.303a.654.654 0 0 0-.082.924l.42.505a.656.656 0 0 0 .924.082l1.127-.925v2.39h-.013v8.532a.662.662 0 0 0 .66.656h17.072a.656.656 0 0 0 .656-.656V24.922l1.128.926a.656.656 0 0 0 .924-.082l.42-.504a.657.657 0 0 0-.083-.926Zm-4.358.352h-.008v9.843h-4.586v-5.906a1.312 1.312 0 0 0-1.312-1.313H24.5a1.312 1.312 0 0 0-1.313 1.313v5.906h-4.606V23.477l.013-.01v-.165l7.218-5.93 7.22 5.932v1.384Z"
    />
  </Svg>
)
export default HomeIcon
