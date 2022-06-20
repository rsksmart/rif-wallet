import { DefaultRelayingServices, SmartWallet } from "@rsksmart/relaying-services-sdk";
import { EnvelopingTransactionDetails } from '@rsksmart/rif-relay-common';
import { RelayClient } from '@rsksmart/rif-relay-client';
import { RIFWallet } from "../core";
import TestToken from '../core/TestToken.json'
import { testTokenAddress } from "../../core/setup";
import { toBN, toHex } from 'web3-utils';
import Web3 from 'web3'


export class RifRelayService {


  private preferedRelays: string[];
  private relayHubAddress: string;
  private relayVerifierAddress: string;
  private deployVerifierAddress: string;
  private smartWalletAddress: string;
  private relayWorkerAddress: string;
  private smartWalletFactoryAddress: string;
  private testTokenAddress: string;
  private rskHost: string;
  private web3: Web3;

  private TRIF_PRICE = 0.000005739


  constructor(
    preferedRelays: string[],
    relayHubAddress: string,
    relayVerifierAddress: string,
    deployVerifierAddress: string,
    smartWalletAddress: string,
    relayWorkerAddress: string,
    smartWalletFactoryAddress: string,
    testTokenAddress: string,
    rskHost: string
  ) {
  
    this.preferedRelays = preferedRelays
    this.relayHubAddress = relayHubAddress
    this.relayVerifierAddress = relayVerifierAddress
    this.deployVerifierAddress = deployVerifierAddress
    this.smartWalletAddress = smartWalletAddress
    this.relayWorkerAddress = relayWorkerAddress
    this.smartWalletFactoryAddress = smartWalletFactoryAddress
    this.testTokenAddress = testTokenAddress
    this.rskHost = rskHost
    this.web3 = new Web3(rskHost)
  }

  async init(wallet: RIFWallet) {
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
    return relayingServices;
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

      if (estimate) {
        const costInRBTC = await this.web3.utils.fromWei(estimate.toString())
        console.log('Cost in RBTC:', costInRBTC)

        const costInTrif = parseFloat(costInRBTC) / this.TRIF_PRICE
        const tokenContract = await this.getTokenContract()
        const ritTokenDecimals = await tokenContract.methods.decimals().call()
        const costInTrifFixed = costInTrif.toFixed(ritTokenDecimals)
        console.log('Cost in TRif: ', costInTrifFixed)

        /*
        if (deployRif.check === true) {
          changeValue(costInRBTC, 'fees')
        } else {
          changeValue(costInTrifFixed, 'fees')
        }
        */
        console.log('Estimation Ended')
      }
    } catch (error) {
      const errorObj = error as Error
      if (errorObj.message) {
        console.log(errorObj.message)
      }
      console.error(error)
    }
  }
  
  private async getTokenContract() {
    const rifTokenContract: any = new this.web3.eth.Contract(
      TestToken.abi as any,
      testTokenAddress,
    )
    rifTokenContract.setProvider(this.web3.currentProvider)
    return rifTokenContract
  }

  async deploySmartWallet(
    rifRelayProvider: DefaultRelayingServices,
    feesAmount: string | number,
    currentSmartWallet: SmartWallet,
  ) {
    try {
      const isTokenAllowed = await rifRelayProvider?.isAllowedToken(
        testTokenAddress
      )

      if (!isTokenAllowed) throw new Error(
        'SmartWallet: was not created because Verifier does not accept the specified token for payment',
      )
      const fees = await this.web3.utils.toWei(`${feesAmount}`)
      const smartWallet = await rifRelayProvider?.deploySmartWallet(
        currentSmartWallet,
        testTokenAddress,
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
      if (errorObj.message) {
        console.log(errorObj.message)
      }
      console.error(error)
    }
    return undefined
  }

  private async checkSmartWalletDeployment(txHash: string) {
    const receipt = await this.getReceipt(txHash)

    if (receipt === null) {
      return false
    }

    console.log('Your receipt is')
    console.log(receipt)
    return receipt.status
  }

  private async getReceipt(transactionHash: string) {
    let receipt = await this.web3.eth.getTransactionReceipt(transactionHash)
    let times = 0

    while (receipt === null && times < 40) {
      times += 1
      // eslint-disable-next-line no-promise-executor-return
      const sleep = new Promise(resolve => setTimeout(resolve, 1000))
      // eslint-disable-next-line no-await-in-loop
      await sleep
      // eslint-disable-next-line no-await-in-loop
      receipt = await this.web3.eth.getTransactionReceipt(transactionHash)
    }

    return receipt
  }

  async estimateFeesToTransfer(
    rifRelayProvider: DefaultRelayingServices,
    wallet: RIFWallet,
    address: string,
    tokenAmount: number | string
  ) {
    try {
      const encodedTransferFunction = (await this.getTokenContract()).methods
      .transfer(
        address,
        await this.web3.utils.toWei(tokenAmount.toString() || "0")
      )
      .encodeABI();
      const trxDetails = {
          from: wallet.smartWallet.address,
          to: testTokenAddress,
          value: "0",
          relayHub: this.relayHubAddress,
          callVerifier: this.relayVerifierAddress,
          callForwarder: wallet.smartWallet.smartWalletAddress,
          data: encodedTransferFunction,
          tokenContract: testTokenAddress,
          // value set just for the estimation; in the original dapp the estimation is performed using an eight of the user's token balance,
          tokenAmount: this.web3.utils.toWei("1"),
          onlyPreferredRelays: true,
      };
      //@ts-ignore
      const maxPossibleGasValue = await this.estimateMaxPossibleRelayGas(rifRelayProvider.relayProvider.relayClient, trxDetails);    
      const gasPrice = toBN(
          //@ts-ignore
          await rifRelayProvider.relayProvider.relayClient._calculateGasPrice()
          );
      console.log('maxPossibleGas, gasPrice', maxPossibleGasValue.toString(), gasPrice.toString());
      const maxPossibleGas = toBN(maxPossibleGasValue);
      const estimate = maxPossibleGas.mul(gasPrice);
  
      const costInRBTC = await this.web3.utils.fromWei(estimate.toString());
      console.log("transfer cost in RBTC:", costInRBTC);

      const costInTrif = parseFloat(costInRBTC) / this.TRIF_PRICE;
      const tokenContract = await this.getTokenContract();
      const ritTokenDecimals = await tokenContract.methods.decimals().call();
      const costInTrifFixed = costInTrif.toFixed(ritTokenDecimals);
      console.log("transfer cost in TRif: ", costInTrifFixed);
      /*
      if (transfer.check === true) {
        changeTransferValue(costInRBTC, 'fees');
      } else {
        changeTransferValue(costInTrifFixed, 'fees');
      }
      */
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: this method should be moved to the sdk
  private async estimateMaxPossibleRelayGas(
    relayClient: RelayClient,
    trxDetails: EnvelopingTransactionDetails
  ) {
    const txDetailsClone = {
        ...trxDetails
    };
    const internalCallCost = await this.estimateDestinationContractCallGas(
        relayClient.getEstimateGasParams(txDetailsClone)
    );
    txDetailsClone.gas = toHex(internalCallCost);
    const tokenGas = (
        await relayClient.estimateTokenTransferGas(
            txDetailsClone,
            '0xc6a4f4839b074b2a75ebf00a9b427ccb8073b7b4'
        )
    ).toString();
    txDetailsClone.tokenGas = tokenGas;
    const maxPossibleGasValue = await relayClient.estimateMaxPossibleRelayGas(
        txDetailsClone,
        '0xc6a4f4839b074b2a75ebf00a9b427ccb8073b7b4'
    );
    return maxPossibleGasValue;
  }

  private async estimateDestinationContractCallGas(
    transactionDetails: EnvelopingTransactionDetails,
    addCushion = true
  ): Promise<string | number> {
    // For relay calls, transactionDetails.gas is only the portion of gas sent to the destination contract, the tokenPayment
    // Part is done before, by the SmartWallet
    const ESTIMATED_GAS_CORRECTION_FACTOR = 1.0;
    // When estimating the gas an internal call is going to spend, we need to subtract some gas inherent to send the parameters to the blockchain
    const INTERNAL_TRANSACTION_ESTIMATE_CORRECTION = 20000;
    const estimated = await this.web3.eth.estimateGas({
        from: transactionDetails.from,
        to: transactionDetails.to,
        gasPrice: transactionDetails.gasPrice,
        data: transactionDetails.data
    });
    let internalCallCost =
        estimated > INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
            ? estimated - INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
            : estimated;
  
    // The INTERNAL_TRANSACTION_ESTIMATE_CORRECTION is substracted because the estimation is done using web3.eth.estimateGas which
    // estimates the call as if it where an external call, and in our case it will be called internally (it's not the same cost).
    // Because of this, the estimated maxPossibleGas in the server (which estimates the whole transaction) might not be enough to successfully pass
    // the following verification made in the SmartWallet:
    // require(gasleft() > req.gas, "Not enough gas left"). This is done right before calling the destination internally
  
    if (addCushion) {
        internalCallCost *= ESTIMATED_GAS_CORRECTION_FACTOR;
    }
  
    return internalCallCost;
  }


  async transferToken(
    rifRelayProvider: DefaultRelayingServices,
    address: string,
    tokenAmount: number | string,
    fees: number,
    smartWalledIsDeployed: boolean,
    wallet: RIFWallet,
  ) {
    try {

      const amount = tokenAmount+"";
      const encodedAbi = (await this.getTokenContract()).methods
          .transfer(address, await this.web3.utils.toWei(amount)).encodeABI();
      const currentSmartWallet = {
        index: 0,
        deployed: smartWalledIsDeployed,
        address: wallet.smartWallet.smartWalletAddress,
      }
      const txDetials = await rifRelayProvider?.relayTransaction(
          {
              to: address
              , data: encodedAbi
          }
          , {
              tokenAddress: testTokenAddress
              , ...currentSmartWallet
          }
          , fees
      );
      console.log(txDetials);
    } catch (error) {
        console.error(error);
    }
  }

}