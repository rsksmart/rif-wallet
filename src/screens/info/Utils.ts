import { testTokenAddress, web3 } from '../../core/setup'
import { toHex } from 'web3-utils';
import TestToken from './contracts/TestToken.json'
import { RelayClient } from '@rsksmart/rif-relay-client';
import { EnvelopingTransactionDetails } from '@rsksmart/rif-relay-common';

export const TRIF_PRICE = 0.000005739
export const TRIF_TOKEN_DECIMALS = 18

class Utils {

  static async tokenBalance(address: string) {
    const rifTokenContract: any = new web3.eth.Contract(
      TestToken.abi as any,
      testTokenAddress,
    )
    rifTokenContract.setProvider(web3.currentProvider)
    const balance = await rifTokenContract.methods.balanceOf(address).call()
    return balance
  }

  static async getTokenContract() {
    const rifTokenContract: any = new web3.eth.Contract(
      TestToken.abi as any,
      testTokenAddress,
    )
    rifTokenContract.setProvider(web3.currentProvider)
    return rifTokenContract
  }

  static async getBalance(address: string) {
    const balance = await web3.eth.getBalance(address)
    return balance
  }

  static fromWei = web3.utils.fromWei
  
  static toWei = web3.utils.toWei

  static getTransactionReceipt = web3.eth.getTransactionReceipt

}


const ESTIMATED_GAS_CORRECTION_FACTOR = 1.0;
// When estimating the gas an internal call is going to spend, we need to subtract some gas inherent to send the parameters to the blockchain
const INTERNAL_TRANSACTION_ESTIMATE_CORRECTION = 20000;
// extracted from rif-relay-common/ContractInteractor
async function estimateDestinationContractCallGas(
  transactionDetails: EnvelopingTransactionDetails,
  addCushion = true
): Promise<string | number> {
  // For relay calls, transactionDetails.gas is only the portion of gas sent to the destination contract, the tokenPayment
  // Part is done before, by the SmartWallet

  const estimated = await web3.eth.estimateGas({
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

// TODO: this method should be moved to the sdk
export async function estimateMaxPossibleRelayGas(
  relayClient: RelayClient,
  trxDetails: EnvelopingTransactionDetails
) {
  const txDetailsClone = {
      ...trxDetails
  };
  const internalCallCost = await estimateDestinationContractCallGas(
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

export default Utils
