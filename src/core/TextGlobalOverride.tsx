import { Text } from 'react-native'
import React from 'react'

const oldTextRender = Text.render

export default function () {
  Text.render = function (...args) {
    const origin = oldTextRender.call(this, ...args)
    const children = origin.props.children
    const style = { fontFamily: 'Poppins-Regular' }
    if (typeof children === 'object') {
      return React.cloneElement(origin, {
        children: React.cloneElement(children, {
          style: [style, children.props.style],
        }),
      })
    }

    return React.cloneElement(origin, {
      style: [style, origin.props.style],
    })
  }
}
