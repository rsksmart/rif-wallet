import React from 'react'
import PinConnector from '../PinConnector'
import { PinDotsRendererType } from './PinScreen'

const PinDotsRenderer: React.FC<PinDotsRendererType> = ({
  index,
  digit,
  arr,
}) => {
  switch (index) {
    case 0:
      return (
        <>
          <PinConnector.BarComp />
          <PinConnector.CenterComp
            CenterInnerComponentProps={{ isFilled: !!digit }}
          />
          <PinConnector.BarComp isActive={!!digit} />
        </>
      )
    default:
      return (
        <>
          <PinConnector.BarComp isActive={!!arr[index - 1]} />
          <PinConnector.CenterComp
            CenterInnerComponentProps={{ isFilled: !!digit }}
          />
          <PinConnector.BarComp
            isActive={index !== arr.length - 1 && !!digit}
          />
        </>
      )
  }
}

export default PinDotsRenderer
