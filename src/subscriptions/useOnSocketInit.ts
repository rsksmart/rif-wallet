import React from 'react'
import { IServiceInitEvent } from 'src/lib/rifWalletServices/RifWalletServicesSocket'
import { Action } from './types'

interface ISocketInit {
  dispatch: React.Dispatch<Action>
}
export const useOnSocketInit = ({ dispatch }: ISocketInit) => {
  return (result: IServiceInitEvent) => {
    dispatch({
      type: 'init',
      payload: result,
    })
  }
}
