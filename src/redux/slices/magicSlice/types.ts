export interface MagicState {
  loading: boolean
}

interface UnlockWithMagicEmailAction {
  type: 'email'
  email: string
}

interface UnlockWithMagicPhoneAction {
  type: 'phone'
  phoneNumber: string
}

export type UnlockWithMagicAction =
  | UnlockWithMagicEmailAction
  | UnlockWithMagicPhoneAction
