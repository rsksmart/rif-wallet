interface IEntryScript {
  entryScriptWeb3: string | null
  init: () => Promise<string>
  get: () => Promise<string>
}

const EntryScriptWeb3: IEntryScript = {
  entryScriptWeb3: null,
  // Cache this so that it is immediately available
  async init() {
    const result = await fetch(
      'https://www.unpkg.com/web3@1.6.1/dist/web3.min.js',
    )

    this.entryScriptWeb3 = await result.text()

    return this.entryScriptWeb3
  },
  async get() {
    // Return from cache
    if (this.entryScriptWeb3) {
      return this.entryScriptWeb3
    }

    // If for some reason it is not available, get it again
    return await this.init()
  },
}

export default EntryScriptWeb3
