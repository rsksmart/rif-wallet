import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { IEnhancedResult, IEnhanceStrategy } from '../AbiEnhancer'
import axios from 'axios'
import { hexDataSlice } from '@ethersproject/bytes'
import { utils } from 'ethers'

const ethList4BytesServiceUrl =
  'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures'
const ethList4BytesWithNamesServiceUrl =
  'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/with_parameter_names'

const getFunctionSignatures = async (fnHexSig: string) => {
  const functionSignaturePromise = axios
    .get(`${ethList4BytesServiceUrl}/${fnHexSig}`)
    .then(x => x.data)
  const functionSignatureWithNamesPromise = axios
    .get(`${ethList4BytesWithNamesServiceUrl}/${fnHexSig}`)
    .then(x => x.data)

  return Promise.all([
    functionSignaturePromise,
    functionSignatureWithNamesPromise,
  ])
}

const getHexSig = (data: utils.BytesLike) => {
  const firstFourBytes = hexDataSlice(data, 0, 4)
  const functionHexWithout0x = firstFourBytes.substring(2)

  return functionHexWithout0x
}

const parseSignature = (signatures: string) => {
  const INSIDE_PARENTHESIS = 1

  const firstSignature = signatures.split(';')[0]

  const parametersExpression = new RegExp(/\((.*)\)/).exec(firstSignature)
  const nameExpression = new RegExp(/(.*)\(/).exec(firstSignature)

  const parameters: string[] = parametersExpression
    ? parametersExpression[INSIDE_PARENTHESIS].split(',')
    : []

  const name = nameExpression ? nameExpression[INSIDE_PARENTHESIS] : ''

  return [name, parameters] as const
}

const parseSignatureWithParametersNames = (
  signaturesWithNames: string,
  parametersTypes: string[],
) => {
  const INSIDE_PARENTHESIS = 1

  const firstSignature = signaturesWithNames.split(';')[0]

  const parametersExpression = new RegExp(/\((.*)\)/).exec(firstSignature)

  const parametersNames: string[] = parametersExpression
    ? parametersExpression[INSIDE_PARENTHESIS].split(',')
    : []

  for (let index = 0; index < parametersNames.length; index++) {
    parametersNames[index] = parametersNames[index]
      .replace(`${parametersTypes[index]} `, '')
      .replace(/[_-\s]/g, '')
  }

  return parametersNames
}

export class OtherEnhanceStrategy implements IEnhanceStrategy {
  public async parse(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const hexSig = getHexSig(transactionRequest.data)

    let signaturesFounded: string[] | null = []
    try {
      signaturesFounded = await getFunctionSignatures(hexSig)
    } catch {
      signaturesFounded = null
    }

    if (!signaturesFounded) {
      return null
    }

    const [signatures, signaturesWithParametersNames] = signaturesFounded

    const [functionName, parametersTypes] = parseSignature(signatures)

    let parametersNames: string[] = []
    let parametersValues: ReadonlyArray<any> = []

    if (parametersTypes.length > 0) {
      parametersNames = parseSignatureWithParametersNames(
        signaturesWithParametersNames,
        parametersTypes,
      )

      parametersValues = utils.defaultAbiCoder.decode(
        parametersTypes,
        hexDataSlice(transactionRequest.data, 4),
      )
    }

    let result: IEnhancedResult = {
      ...transactionRequest,
      functionName,
      functionParameters: [],
      from: transactionRequest.from!,
      to: transactionRequest.to!,
    }
    for (let index = 0; index < parametersNames.length; index++) {
      const name = parametersNames[index]
      const value = parametersValues[index]
      result.functionParameters.push({ name, value })
    }

    return result
  }
}
