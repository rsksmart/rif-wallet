import React from 'react'
import PinConnector from '../PinConnector'
import { PinDotsRendererType } from './PinScreen'

const PinDotsRenderer: React.FC<PinDotsRendererType> = ({
  index,
  digit,
  arr,
}) => {
  return (
    <>
      <PinConnector.BarComp isActive={index > 0 && !!digit} />
      <PinConnector.CenterComp
        CenterInnerComponentProps={{ isFilled: !!digit }}
      />
      <PinConnector.BarComp isActive={index < arr.length && !!arr[index + 1]} />
    </>
  )
}

export default PinDotsRenderer
