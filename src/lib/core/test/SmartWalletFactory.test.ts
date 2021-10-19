import { deploySmartWalletFactory, createNewTestWallet } from './utils'
import { SmartWalletFactory } from '../src/SmartWalletFactory'

describe('SmartWalletFactory', function (this: {
  smartWalletFactory: SmartWalletFactory
}) {
  beforeEach(async () => {
    const smartWalletFactoryContract = await deploySmartWalletFactory()
    const wallet = await createNewTestWallet()
    this.smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
  })

  test('has a smart address', async () => {
    expect(await this.smartWalletFactory.getSmartWalletAddress()).toBeDefined()
  })

  test('initially should be not deployed', async () => {
    expect(await this.smartWalletFactory.isDeployed()).toBeFalsy()
  })

  test('deploys smart wallet', async () => {
    const tx = await this.smartWalletFactory.deploy()
    await tx.wait()
    expect(await this.smartWalletFactory.isDeployed()).toBeTruthy()
  })
})
