import { createAction } from '@reduxjs/toolkit'

// this action will reset balances and transactions in redux
export const resetSocketState = createAction('RESET_SOCKET_STATE')
