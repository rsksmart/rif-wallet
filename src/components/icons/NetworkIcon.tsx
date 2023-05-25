import Svg, { Path, Rect } from 'react-native-svg'

import { FooterIconInterface } from '.'

const NetworkIcon = ({ active = false, ...props }: FooterIconInterface) => (
  <Svg width={52} height={52} fill="none" {...props}>
    {active && <Rect width={52} height={52} fill="#4B5CF0" rx={26} />}
    <Path
      fill="#fff"
      d="M35.797 30.594a2.94 2.94 0 0 0-2.018.808l-3.208-1.834c.185-.5.304-1.033.304-1.6a4.591 4.591 0 0 0-4.594-4.593c-.344 0-.68.045-1 .119l-1.321-2.83a2.93 2.93 0 0 0 1.009-2.207 2.951 2.951 0 0 0-2.953-2.953 2.951 2.951 0 0 0-2.953 2.953 2.951 2.951 0 0 0 2.953 2.953c.037 0 .074-.008.11-.012l1.374 2.94a4.56 4.56 0 0 0-1.813 3.63 4.591 4.591 0 0 0 7.826 3.262l3.372 1.927c-.017.127-.041.259-.041.39a2.951 2.951 0 0 0 2.953 2.953 2.951 2.951 0 0 0 2.953-2.953 2.951 2.951 0 0 0-2.953-2.953ZM22.016 19.437a.987.987 0 0 1-.985-.984c0-.541.443-.984.985-.984.541 0 .984.443.984.984a.987.987 0 0 1-.984.985Zm4.265 11.157a2.627 2.627 0 0 1-2.625-2.625 2.627 2.627 0 0 1 2.625-2.625 2.627 2.627 0 0 1 2.625 2.625 2.627 2.627 0 0 1-2.625 2.625Zm9.516 3.937a.987.987 0 0 1-.984-.984c0-.541.442-.984.984-.984.541 0 .984.442.984.984a.987.987 0 0 1-.984.984Zm-2.231-10.713-.788-1.05-1.969 1.476.788 1.05 1.969-1.476Zm2.559-.443a2.627 2.627 0 0 0 2.625-2.625 2.627 2.627 0 0 0-2.625-2.625A2.627 2.627 0 0 0 33.5 20.75a2.627 2.627 0 0 0 2.625 2.625Zm-17.39 5.25h1.968v-1.313h-1.969v1.313Zm-3.61-3.281a2.627 2.627 0 0 0-2.625 2.625 2.627 2.627 0 0 0 2.625 2.625 2.627 2.627 0 0 0 2.625-2.625 2.627 2.627 0 0 0-2.625-2.625Z"
    />
  </Svg>
)
export default NetworkIcon
