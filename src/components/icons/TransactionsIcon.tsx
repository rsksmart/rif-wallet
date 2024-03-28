import Svg, { Path, Rect } from 'react-native-svg'

import { sharedColors } from 'shared/constants'

import { FooterIconInterface } from '.'

const TransactionsIcon = ({
  active = false,
  activeColor = sharedColors.primary,
  ...props
}: FooterIconInterface) => (
  <Svg width={52} height={52} fill="none" {...props}>
    {active && <Rect width={52} height={52} fill={activeColor} rx={26} />}
    <Path
      fill={sharedColors.text.primary}
      d="m36.849 22.529-4.313 3.966a.546.546 0 0 1-.73 0l-.843-.778a.45.45 0 0 1 .008-.68l2.201-1.893H15.516c-.285 0-.516-.213-.516-.476v-.952c0-.263.23-.476.516-.476h17.656l-2.201-1.892a.45.45 0 0 1-.008-.68l.844-.779a.546.546 0 0 1 .729 0l4.313 3.967a.45.45 0 0 1 0 .673Zm-21.698 7.615 4.313 3.967a.546.546 0 0 0 .73 0l.843-.779a.45.45 0 0 0-.008-.68l-2.201-1.892h17.656c.285 0 .516-.213.516-.476v-.952c0-.263-.23-.476-.516-.476H18.828l2.201-1.893a.45.45 0 0 0 .008-.68l-.844-.778a.546.546 0 0 0-.729 0l-4.313 3.966a.45.45 0 0 0 0 .673Z"
    />
  </Svg>
)
export default TransactionsIcon
