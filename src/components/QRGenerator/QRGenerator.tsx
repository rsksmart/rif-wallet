import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  ImageSourcePropType,
  LayoutChangeEvent,
  View,
  ViewStyle,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Icon } from 'react-native-vector-icons/Icon'

import { sharedColors } from 'shared/constants'

interface QRIconProps {
  name: string
  color: string
  Component: typeof Icon
}
interface QRGeneratorProps {
  value: string
  iconProps?: QRIconProps
  imageSource?: ImageSourcePropType
  qrWidth?: number
  qrBackgroundColor?: string
  qrColor?: string
  qrMargin?: number
  logoBackgroundColor?: string
  containerViewStyle?: ViewStyle
}

/**
 * QR Generator
 * @param qrWidth - if undefined - it'll take the view available space
 * @param iconProps
 * @param imageSource - iconProps will override this imageSource
 * @param value
 * @param qrBackgroundColor
 * @param qrColor
 * @param qrMargin
 * @param containerViewStyle
 * @param logoBackgroundColor
 */
export const QRGenerator = ({
  value,
  qrWidth = 100,
  iconProps,
  imageSource,
  qrBackgroundColor = sharedColors.inputInactive,
  qrColor = sharedColors.qrColor,
  qrMargin = 10,
  containerViewStyle,
  logoBackgroundColor,
}: QRGeneratorProps) => {
  const [width, setWidth] = useState(qrWidth)
  const [iconSource, setIconSource] = useState(imageSource)

  const onWidthChange = useCallback(
    (e: LayoutChangeEvent) => {
      if (qrWidth === undefined) {
        setWidth(e.nativeEvent.layout.width)
      }
    },
    [qrWidth],
  )

  const viewWidth = useMemo(() => {
    if (qrWidth) {
      return { width: qrWidth }
    }
    return {}
  }, [qrWidth])

  const logoMargin = useMemo(() => width * 0.07, [width])
  const logoSize = useMemo(() => width * 0.15, [width])
  const logoBorderRadius = useMemo(() => width * 0.4, [width])

  useEffect(() => {
    if (iconProps) {
      const { Component, name, color } = iconProps

      Component.getImageSource(name, logoSize, color).then(iconImage => {
        setIconSource(iconImage)
      })
    }
  }, [iconProps, logoSize])

  return (
    <View style={[viewWidth, containerViewStyle]} onLayout={onWidthChange}>
      <QRCode
        key={width}
        value={value}
        size={width}
        logo={iconSource}
        logoBackgroundColor={logoBackgroundColor}
        logoSize={logoSize}
        color={qrColor}
        logoBorderRadius={logoBorderRadius}
        quietZone={qrMargin}
        logoMargin={logoMargin}
        backgroundColor={qrBackgroundColor}
      />
    </View>
  )
}
