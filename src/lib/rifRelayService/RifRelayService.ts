import { DefaultRelayingServices } from "@rsksmart/relaying-services-sdk";
import { RIFWallet } from "../core";

export class RifRelayService {


  private preferedRelays: string[];
  private smartWalletFactoryAddress: string;
  private testTokenAddress: string;
  private rskHost: string;


  constructor(
    preferedRelays: string[],
    smartWalletFactoryAddress: string,
    testTokenAddress: string,
    rskHost: string
  ) {
  
    this.preferedRelays = preferedRelays
    this.smartWalletFactoryAddress = smartWalletFactoryAddress
    this.testTokenAddress = testTokenAddress
    this.rskHost = rskHost
  }

  async init(wallet: RIFWallet) {
    const config = {
      verbose: false,
      chainId: 31,
      gasPriceFactorPercent: '0',
      relayLookupWindowBlocks: 1e5,
      preferredRelays: this.preferedRelays,
      relayHubAddress: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
      relayVerifierAddress: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
      deployVerifierAddress: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
      smartWalletFactoryAddress: this.smartWalletFactoryAddress,
    } as any
  
    const contractAddresses = {
      relayHub: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
      smartWallet: '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014',
      smartWalletFactory: this.smartWalletFactoryAddress,
      smartWalletDeployVerifier: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
      smartWalletRelayVerifier: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
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

}