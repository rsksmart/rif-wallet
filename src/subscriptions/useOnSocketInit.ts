import React from 'react'
import { Action } from './types'

interface ISocketInit {
  dispatch: React.Dispatch<Action>
}
export const useOnSocketInit = ({ dispatch }: ISocketInit) => {
  return (result: any) => {
    dispatch({
      type: 'init',
      payload: result,
    })
  }
}
