export class RPCAdapter {
  private resolvers: IResolver[]

  constructor(resolvers: IResolver[]) {
    this.resolvers = resolvers
  }

  async handleCall(method: string, params: any[]) {
    const resolver = this.resolvers.find(x => x.methodName === method)

    if (!resolver) {
      throw new Error(`'${method}' method not supported by Adapter.`)
    }

    return resolver.resolve(params)
  }
}

export interface IResolver {
  methodName: string
  resolve: (params: any[]) => Promise<any>
}
