import { createStore } from './SecureStore'

const key = 'SIGNUP'
const SignupStore = createStore(key)
export type ISignupStore = {
  signedup: boolean
}
export const hasSignUP = SignupStore.has

export const getSignUP = async () => {
  const jsonSignUp = (await SignupStore.has()) ? await SignupStore.get() : '{}'
  const store: ISignupStore = JSON.parse(jsonSignUp || '{}')
  return store
}

export const deleteSignUp = SignupStore.remove

export const saveSignUp = async (signUp: ISignupStore) =>
  SignupStore.save(JSON.stringify(signUp))
