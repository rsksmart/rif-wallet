import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

type CenterInnerCompType = React.FC<ViewProps> & {
  isFilled?: boolean
}
const CenterInnerComp: React.FC<CenterInnerCompType> = ({
  isFilled = false,
  ...props
}) => (
  <View
    style={[
      dotConnectorStyles.dotStyle,
      !isFilled ? dotConnectorStyles.dotIsFilled : [],
    ]}
    {...props}
  />
)
type CenterCompType = ViewProps & {
  CenterInnerComponent?: any
  CenterInnerComponentProps?: object
}
const CenterComp: React.FC<CenterCompType> = ({
  CenterInnerComponent = CenterInnerComp,
  CenterInnerComponentProps = {},
  ...props
}) => (
  <View style={dotConnectorStyles.centerCompView} {...props}>
    <CenterInnerComponent {...CenterInnerComponentProps} />
  </View>
)

type BarCompType = ViewProps & {
  isActive?: boolean
}
const BarComp: React.FC<BarCompType> = ({ isActive, ...props }) => (
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
type DotConnectorProps = {
  CenterComponent?: React.FC
  LeftComponent?: React.FC
  RightComponent?: React.FC
  [key: string]: any
}

type CompositionType = {
  Container: React.FC
  BarComp: React.FC<BarCompType>
  CenterComp: React.FC<CenterCompType>
}

const PinConnector: React.FC<DotConnectorProps> & CompositionType = ({
  LeftComponent = BarComp,
  RightComponent = BarComp,
  CenterComponent = CenterComp,
}) => {
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
