import BIP from './BIP'

export type createBipFactoryType = ConstructorParameters<typeof BIP>
export default function createBipFactory(...args: createBipFactoryType): BIP {
  return new BIP(...args)
}
