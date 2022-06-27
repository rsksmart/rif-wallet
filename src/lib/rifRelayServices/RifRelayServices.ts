import {
  DefaultRelayingServices,
  SmartWallet,
} from '@rsksmart/relaying-services-sdk'
import { EnvelopingTransactionDetails } from '@rsksmart/rif-relay-common'
import { RelayClient } from '@rsksmart/rif-relay-client'
import { RIFWallet } from '../core'
import { BigNumber, ethers, utils } from 'ethers'
import { ERC20__factory } from '../token/types'
import { RifRelayConfiguration } from './types'

export class RifRelayServices {
  private preferedRelays: string[]
  private relayHubAddress: string
  private relayVerifierAddress: string
  private deployVerifierAddress: string
  private smartWalletAddress: string
  private relayWorkerAddress: string
  private smartWalletFactoryAddress: string
  private testTokenAddress: string
  private rskHost: string
  private wallet: RIFWallet | undefined

  private TRIF_PRICE = 0.000005739

  constructor(
    config: RifRelayConfiguration
  ) {
    this.preferedRelays = config.preferedRelays
    this.relayHubAddress = config.relayHubAddress
    this.relayVerifierAddress = config.relayVerifierAddress
    this.deployVerifierAddress = config.deployVerifierAddress
    this.smartWalletAddress = config.smartWalletAddress
    this.relayWorkerAddress = config.relayWorkerAddress
    this.smartWalletFactoryAddress = config.smartWalletFactoryAddress
    this.testTokenAddress = config.testTokenAddress
    this.rskHost = config.rskHost
    this.wallet = undefined
  }

  async initialize(wallet: RIFWallet) {
    console.error('initializing rif relay service')
    this.wallet = wallet
    const config = {
      verbose: false,
      chainId: 31,
      gasPriceFactorPercent: '0',
      relayLookupWindowBlocks: 1e5,
      preferredRelays: this.preferedRelays,
      relayHubAddress: this.relayHubAddress,
      relayVerifierAddress: this.relayVerifierAddress,
      deployVerifierAddress: this.deployVerifierAddress,
      smartWalletFactoryAddress: this.smartWalletFactoryAddress,
    } as any

    const contractAddresses = {
      relayHub: this.relayHubAddress,
      smartWallet: this.smartWalletAddress,
      smartWalletFactory: this.smartWalletFactoryAddress,
      smartWalletDeployVerifier: this.deployVerifierAddress,
      smartWalletRelayVerifier: this.relayVerifierAddress,
      testToken: this.testTokenAddress,
    } as any

    //@ts-ignore
    const privateKey = wallet.smartWallet.signer.privateKey
    const relayingServices = new DefaultRelayingServices({
      rskHost: this.rskHost,
      account: {
        address: wallet.smartWallet.address,
        privateKey: privateKey,
      },
    } as any)
    await relayingServices.initialize(config, contractAddresses)
    return relayingServices
    // return undefined
  }

  async estimateFeesToDeploySmartWallet(
    rifRelayProvider: DefaultRelayingServices,
    currentSmartWallet: SmartWallet,
  ) {
    try {
      const estimate = await rifRelayProvider.estimateMaxPossibleRelayGas(
        currentSmartWallet,
        this.relayWorkerAddress,
      )

      if (!estimate) {
        throw new Error('Error getting estimation')
      }

      const costInRBTC = utils.formatEther(estimate.toString())

      const costInTrif = parseFloat(costInRBTC) / this.TRIF_PRICE
      const ritTokenDecimals = await this.getTokenContract().decimals()
      const costInTrifFixed = costInTrif.toFixed(ritTokenDecimals)
      return costInTrifFixed
    } catch (error) {
      const errorObj = error as Error
      if (errorObj.message) {
        console.log(errorObj.message)
      }
      console.error(error)
    }
  }

  private getTokenContract() {
    const contract = new ethers.Contract(
      this.testTokenAddress,
      ERC20__factory.abi,
      this.wallet?.provider,
    )
    return contract
  }

  async deploySmartWallet(
    rifRelayProvider: DefaultRelayingServices,
    feesAmount: string | number,
    currentSmartWallet: SmartWallet,
  ) {
    try {
      const isTokenAllowed = await rifRelayProvider?.isAllowedToken(
        this.testTokenAddress,
      )

      if (!isTokenAllowed) {
        throw new Error(
          'SmartWallet: was not created because Verifier does not accept the specified token for payment',
        )
      }
      const fees = utils.parseEther(`${feesAmount}`).toString()
      const smartWallet = await rifRelayProvider?.deploySmartWallet(
        currentSmartWallet,
        this.testTokenAddress,
        fees as any,
      )
      const smartWalledIsDeployed = await this.checkSmartWalletDeployment(
        smartWallet?.deployTransaction!,
      )
      if (!smartWalledIsDeployed) {
        throw new Error('SmartWallet: deployment failed')
      }
      return smartWallet
    } catch (error) {
      const errorObj = error as Error
    }
    return undefined
  }

  private checkSmartWalletDeployment(txHash: string) {
    return this.wallet?.provider
      ?.waitForTransaction(txHash)
      .then(receipt => receipt.status)
      .catch(() => false)
  }

  async estimateFeesToTransfer(
    rifRelayProvider: DefaultRelayingServices,
    address: string,
    tokenAmount: number | string,
  ) {
    try {
      const encodedTransferFunction =
        this.getTokenContract().interface.encodeFunctionData('transfer', [
          address,
          utils.parseEther(tokenAmount.toString() || '0'),
        ])
      const trxDetails = {
        from: this.wallet!.smartWallet.address,
        to: this.testTokenAddress,
        value: '0',
        relayHub: this.relayHubAddress,
        callVerifier: this.relayVerifierAddress,
        callForwarder: this.wallet!.smartWallet.smartWalletAddress,
        data: encodedTransferFunction,
        tokenContract: this.testTokenAddress,
        // value set just for the estimation; in the original dapp the estimation is performed using an eight of the user's token balance,
        tokenAmount: utils.parseEther('1').toString(),
        onlyPreferredRelays: true,
      }
      const maxPossibleGasValue = await this.estimateMaxPossibleRelayGas(
        //@ts-ignore
        rifRelayProvider.relayProvider.relayClient,
        trxDetails,
      )
      const gasPrice = BigNumber.from(
        //@ts-ignore
        await rifRelayProvider.relayProvider.relayClient._calculateGasPrice(),
      )
      const maxPossibleGas = BigNumber.from(maxPossibleGasValue)
      const estimate = maxPossibleGas.mul(gasPrice)

      const costInRBTC = utils.formatEther(estimate.toString())

      const costInTrif = parseFloat(costInRBTC) / this.TRIF_PRICE
      const ritTokenDecimals = await this.getTokenContract().decimals()
      const costInTrifFixed = costInTrif.toFixed(ritTokenDecimals)
      return costInTrifFixed
    } catch (error) {
      console.error(error)
    }
  }

  // TODO: this method should be moved to the sdk
  private async estimateMaxPossibleRelayGas(
    relayClient: RelayClient,
    trxDetails: EnvelopingTransactionDetails,
  ) {
    const txDetailsClone = {
      ...trxDetails,
    }
    const internalCallCost = await this.estimateDestinationContractCallGas(
      relayClient.getEstimateGasParams(txDetailsClone),
    )
    txDetailsClone.gas = utils.hexlify(internalCallCost)
    const tokenGas = (
      await relayClient.estimateTokenTransferGas(
        txDetailsClone,
        this.relayWorkerAddress,
      )
    ).toString()
    txDetailsClone.tokenGas = tokenGas
    const maxPossibleGasValue = await relayClient.estimateMaxPossibleRelayGas(
      txDetailsClone,
      this.relayWorkerAddress,
    )
    return maxPossibleGasValue
  }

  private async estimateDestinationContractCallGas(
    transactionDetails: EnvelopingTransactionDetails,
    addCushion = true,
  ): Promise<string | number> {
    // For relay calls, transactionDetails.gas is only the portion of gas sent to the destination contract, the tokenPayment
    // Part is done before, by the SmartWallet
    const ESTIMATED_GAS_CORRECTION_FACTOR = 1.0
    // When estimating the gas an internal call is going to spend, we need to subtract some gas inherent to send the parameters to the blockchain
    const INTERNAL_TRANSACTION_ESTIMATE_CORRECTION = 20000
    const estimated = (
      await this.wallet?.provider?.estimateGas({
        from: transactionDetails.from,
        to: transactionDetails.to,
        gasPrice: transactionDetails.gasPrice,
        data: transactionDetails.data,
      })
    )?.toNumber()
    let internalCallCost =
      estimated! > INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
        ? estimated! - INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
        : estimated!

    // The INTERNAL_TRANSACTION_ESTIMATE_CORRECTION is substracted because the estimation is done using web3.eth.estimateGas which
    // estimates the call as if it where an external call, and in our case it will be called internally (it's not the same cost).
    // Because of this, the estimated maxPossibleGas in the server (which estimates the whole transaction) might not be enough to successfully pass
    // the following verification made in the SmartWallet:
    // require(gasleft() > req.gas, "Not enough gas left"). This is done right before calling the destination internally

    if (addCushion) {
      internalCallCost *= ESTIMATED_GAS_CORRECTION_FACTOR
    }

    return internalCallCost
  }

  async transferToken(
    rifRelayProvider: DefaultRelayingServices,
    address: string,
    tokenAmount: number | string,
    fees: number,
    smartWalledIsDeployed: boolean,
  ) {
    try {
      const amount = tokenAmount + ''
      const encodedAbi = this.getTokenContract().interface.encodeFunctionData(
        'transfer',
        [address, utils.parseEther(amount).toString()],
      )

      const currentSmartWallet = {
        index: 0,
        deployed: smartWalledIsDeployed,
        address: this.wallet!.smartWallet.smartWalletAddress,
      }
      const txDetials = await rifRelayProvider?.relayTransaction(
        {
          to: address,
          data: encodedAbi,
        },
        {
          tokenAddress: this.testTokenAddress,
          ...currentSmartWallet,
        },
        fees,
      )
    } catch (error) {
      
    }
  }
}
