import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

type CenterInnerCompType = ViewProps & {
  isFilled?: boolean
}
const CenterInnerComp = ({
  isFilled = false,
  ...props
}: CenterInnerCompType) => (
  <View
    style={[
      dotConnectorStyles.dotStyle,
      !isFilled ? dotConnectorStyles.dotIsFilled : [],
    ]}
    {...props}
  />
)
type CenterCompType = ViewProps & {
  CenterInnerComponent?: FC
  CenterInnerComponentProps?: object
}
const CenterComp = ({
  CenterInnerComponent = CenterInnerComp,
  CenterInnerComponentProps = {},
  ...props
}: CenterCompType) => (
  <View style={dotConnectorStyles.centerCompView} {...props}>
    <CenterInnerComponent {...CenterInnerComponentProps} />
  </View>
)

type BarCompType = ViewProps & {
  isActive?: boolean
}
const BarComp = ({ isActive, ...props }: BarCompType) => (
  <View
    style={[
      dotConnectorStyles.commonBar,
      isActive ? dotConnectorStyles.commonBarIsActive : {},
    ]}
    {...props}
  />
)
const ContainerComp: React.FC<ViewProps> = ({ children }) => (
  <View style={dotConnectorStyles.container}>{children}</View>
)
interface DotConnectorProps {
  CenterComponent?: FC
  LeftComponent?: FC
  RightComponent?: FC
}

interface CompositionType {
  Container: FC
  BarComp: BarCompType
  CenterComp: CenterCompType
}

const PinConnector = ({
  LeftComponent = BarComp,
  RightComponent = BarComp,
  CenterComponent = CenterComp,
}: DotConnectorProps & CompositionType) => {
  return (
    <ContainerComp>
      {LeftComponent && <LeftComponent />}
      <CenterComponent />
      {RightComponent && <RightComponent />}
    </ContainerComp>
  )
}

PinConnector.Container = ContainerComp
PinConnector.BarComp = BarComp
PinConnector.CenterComp = CenterComp

const dotConnectorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  commonBar: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  commonBarIsActive: {
    backgroundColor: '#034f5d',
  },
  dotStyle: {
    backgroundColor: '#25d9b5',
    borderRadius: 40,
    height: 15,
    width: 15,
  },
  dotIsFilled: {
    backgroundColor: '#4536FD',
  },
  centerCompView: {
    marginHorizontal: -5,
    zIndex: 2,
  },
})

export default PinConnector
