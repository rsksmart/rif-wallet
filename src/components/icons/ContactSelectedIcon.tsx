import Svg, { Path, SvgProps } from 'react-native-svg'

const ContactSelectedIcon = (props: SvgProps) => (
  <Svg width={19} height={21} fill="none" {...props}>
    <Path
      d="M14.99 20.207H5.34a3.558 3.558 0 0 1-3.558-3.558V3.558A3.558 3.558 0 0 1 5.34 0h9.65a3.558 3.558 0 0 1 3.558 3.558v13.091a3.558 3.558 0 0 1-3.558 3.558"
      fill="#DBE3FF"
    />
    <Path
      d="M10.253 4.542a5.355 5.355 0 1 1 0 10.71 5.355 5.355 0 0 1 0-10.71"
      fill="#4536FD"
      opacity={0.15}
    />
    <Path
      d="M6.696 13.754a3.9 3.9 0 0 1 3.61-2.471 3.7 3.7 0 0 1 3.5 2.471s-.856 1.525-3.5 1.5a4.289 4.289 0 0 1-3.61-1.5"
      fill="#4536FD"
    />
    <Path
      d="M10.252 7.219a2.142 2.142 0 1 1 0 4.284 2.142 2.142 0 0 1 0-4.284Z"
      fill="#4536FD"
    />
    <Path
      d="M1 5.208h1.565M1 9.897h1.565M1 14.862h1.565"
      stroke="#4536FD"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ContactSelectedIcon
