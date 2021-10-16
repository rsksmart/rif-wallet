/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC677, ERC677Interface } from "../ERC677";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialAccount",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initialBalance",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenSymbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "transferAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001e8638038062001e86833981810160405281019062000037919062000355565b818181600390805190602001906200005192919062000205565b5080600490805190602001906200006a92919062000205565b50505062000088848462000092640100000000026401000000009004565b50505050620006c5565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000105576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000fc9062000446565b60405180910390fd5b620001226000838362000200640100000000026401000000009004565b8060026000828254620001369190620004fd565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546200018d9190620004fd565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001f4919062000468565b60405180910390a35050565b505050565b8280546200021390620005ce565b90600052602060002090601f01602090048101928262000237576000855562000283565b82601f106200025257805160ff191683800117855562000283565b8280016001018555821562000283579182015b828111156200028257825182559160200191906001019062000265565b5b50905062000292919062000296565b5090565b5b80821115620002b157600081600090555060010162000297565b5090565b6000620002cc620002c684620004b9565b62000485565b905082815260208101848484011115620002e557600080fd5b620002f284828562000598565b509392505050565b6000815190506200030b8162000691565b92915050565b600082601f8301126200032357600080fd5b815162000335848260208601620002b5565b91505092915050565b6000815190506200034f81620006ab565b92915050565b600080600080608085870312156200036c57600080fd5b60006200037c87828801620002fa565b94505060206200038f878288016200033e565b935050604085015167ffffffffffffffff811115620003ad57600080fd5b620003bb8782880162000311565b925050606085015167ffffffffffffffff811115620003d957600080fd5b620003e78782880162000311565b91505092959194509250565b600062000402601f83620004ec565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b62000440816200058e565b82525050565b600060208201905081810360008301526200046181620003f3565b9050919050565b60006020820190506200047f600083018462000435565b92915050565b6000604051905081810181811067ffffffffffffffff82111715620004af57620004ae62000662565b5b8060405250919050565b600067ffffffffffffffff821115620004d757620004d662000662565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b60006200050a826200058e565b915062000517836200058e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200054f576200054e62000604565b5b828201905092915050565b600062000567826200056e565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620005b85780820151818401526020810190506200059b565b83811115620005c8576000848401525b50505050565b60006002820490506001821680620005e757607f821691505b60208210811415620005fe57620005fd62000633565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200069c816200055a565b8114620006a857600080fd5b50565b620006b6816200058e565b8114620006c257600080fd5b50565b6117b180620006d56000396000f3fe608060405234801561001057600080fd5b50600436106100d1576000357c0100000000000000000000000000000000000000000000000000000000900480634000aea01161008e5780634000aea0146101c057806370a08231146101f057806395d89b4114610220578063a457c2d71461023e578063a9059cbb1461026e578063dd62ed3e1461029e576100d1565b806306fdde03146100d6578063095ea7b3146100f457806318160ddd1461012457806323b872dd14610142578063313ce567146101725780633950935114610190575b600080fd5b6100de6102ce565b6040516100eb9190611344565b60405180910390f35b61010e60048036038101906101099190610ea7565b610360565b60405161011b9190611329565b60405180910390f35b61012c61037e565b6040516101399190611446565b60405180910390f35b61015c60048036038101906101579190610e58565b610388565b6040516101699190611329565b60405180910390f35b61017a610489565b6040516101879190611491565b60405180910390f35b6101aa60048036038101906101a59190610ea7565b610492565b6040516101b79190611329565b60405180910390f35b6101da60048036038101906101d59190610ee3565b61053e565b6040516101e79190611329565b60405180910390f35b61020a60048036038101906102059190610df3565b610682565b6040516102179190611446565b60405180910390f35b6102286106ca565b6040516102359190611344565b60405180910390f35b61025860048036038101906102539190610ea7565b61075c565b6040516102659190611329565b60405180910390f35b61028860048036038101906102839190610ea7565b610850565b6040516102959190611329565b60405180910390f35b6102b860048036038101906102b39190610e1c565b61086e565b6040516102c59190611446565b60405180910390f35b6060600380546102dd90611666565b80601f016020809104026020016040519081016040528092919081815260200182805461030990611666565b80156103565780601f1061032b57610100808354040283529160200191610356565b820191906000526020600020905b81548152906001019060200180831161033957829003601f168201915b5050505050905090565b600061037461036d6108f5565b84846108fd565b6001905092915050565b6000600254905090565b6000610395848484610ac8565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006103e06108f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610460576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610457906113c6565b60405180910390fd5b61047d8561046c6108f5565b8584610478919061159b565b6108fd565b60019150509392505050565b60006012905090565b600061053461049f6108f5565b8484600160006104ad6108f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461052f9190611545565b6108fd565b6001905092915050565b60008061054b8585610850565b90508061055c57600091505061067b565b8473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fe19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c1686866040516105bb929190611461565b60405180910390a360008590508073ffffffffffffffffffffffffffffffffffffffff1663c0ee0b8a3387876040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401610621939291906112eb565b602060405180830381600087803b15801561063b57600080fd5b505af115801561064f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106739190610f4a565b506001925050505b9392505050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546106d990611666565b80601f016020809104026020016040519081016040528092919081815260200182805461070590611666565b80156107525780601f1061072757610100808354040283529160200191610752565b820191906000526020600020905b81548152906001019060200180831161073557829003601f168201915b5050505050905090565b6000806001600061076b6108f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610828576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081f90611426565b60405180910390fd5b6108456108336108f5565b858584610840919061159b565b6108fd565b600191505092915050565b600061086461085d6108f5565b8484610ac8565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561096d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096490611406565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156109dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d490611386565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610abb9190611446565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610b38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b2f906113e6565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ba8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b9f90611366565b60405180910390fd5b610bb3838383610d47565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c39576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c30906113a6565b60405180910390fd5b8181610c45919061159b565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610cd59190611545565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d399190611446565b60405180910390a350505050565b505050565b6000610d5f610d5a846114dd565b6114ac565b905082815260208101848484011115610d7757600080fd5b610d82848285611624565b509392505050565b600081359050610d9981611736565b92915050565b600081519050610dae8161174d565b92915050565b600082601f830112610dc557600080fd5b8135610dd5848260208601610d4c565b91505092915050565b600081359050610ded81611764565b92915050565b600060208284031215610e0557600080fd5b6000610e1384828501610d8a565b91505092915050565b60008060408385031215610e2f57600080fd5b6000610e3d85828601610d8a565b9250506020610e4e85828601610d8a565b9150509250929050565b600080600060608486031215610e6d57600080fd5b6000610e7b86828701610d8a565b9350506020610e8c86828701610d8a565b9250506040610e9d86828701610dde565b9150509250925092565b60008060408385031215610eba57600080fd5b6000610ec885828601610d8a565b9250506020610ed985828601610dde565b9150509250929050565b600080600060608486031215610ef857600080fd5b6000610f0686828701610d8a565b9350506020610f1786828701610dde565b925050604084013567ffffffffffffffff811115610f3457600080fd5b610f4086828701610db4565b9150509250925092565b600060208284031215610f5c57600080fd5b6000610f6a84828501610d9f565b91505092915050565b610f7c816115cf565b82525050565b610f8b816115e1565b82525050565b6000610f9c8261150d565b610fa68185611523565b9350610fb6818560208601611633565b610fbf81611725565b840191505092915050565b6000610fd582611518565b610fdf8185611534565b9350610fef818560208601611633565b610ff881611725565b840191505092915050565b6000611010602383611534565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611076602283611534565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006110dc602683611534565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611142602883611534565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206160008301527f6c6c6f77616e63650000000000000000000000000000000000000000000000006020830152604082019050919050565b60006111a8602583611534565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061120e602483611534565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611274602583611534565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6112d68161160d565b82525050565b6112e581611617565b82525050565b60006060820190506113006000830186610f73565b61130d60208301856112cd565b818103604083015261131f8184610f91565b9050949350505050565b600060208201905061133e6000830184610f82565b92915050565b6000602082019050818103600083015261135e8184610fca565b905092915050565b6000602082019050818103600083015261137f81611003565b9050919050565b6000602082019050818103600083015261139f81611069565b9050919050565b600060208201905081810360008301526113bf816110cf565b9050919050565b600060208201905081810360008301526113df81611135565b9050919050565b600060208201905081810360008301526113ff8161119b565b9050919050565b6000602082019050818103600083015261141f81611201565b9050919050565b6000602082019050818103600083015261143f81611267565b9050919050565b600060208201905061145b60008301846112cd565b92915050565b600060408201905061147660008301856112cd565b81810360208301526114888184610f91565b90509392505050565b60006020820190506114a660008301846112dc565b92915050565b6000604051905081810181811067ffffffffffffffff821117156114d3576114d26116f6565b5b8060405250919050565b600067ffffffffffffffff8211156114f8576114f76116f6565b5b601f19601f8301169050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b60006115508261160d565b915061155b8361160d565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156115905761158f611698565b5b828201905092915050565b60006115a68261160d565b91506115b18361160d565b9250828210156115c4576115c3611698565b5b828203905092915050565b60006115da826115ed565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b83811015611651578082015181840152602081019050611636565b83811115611660576000848401525b50505050565b6000600282049050600182168061167e57607f821691505b60208210811415611692576116916116c7565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b61173f816115cf565b811461174a57600080fd5b50565b611756816115e1565b811461176157600080fd5b50565b61176d8161160d565b811461177857600080fd5b5056fea2646970667358221220a2500835a30112ddb6f5a0118cc2b5cd7e67354faf56696239fed5a2ff19c01764736f6c63430008000033";

export class ERC677__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    initialAccount: string,
    initialBalance: BigNumberish,
    tokenName: string,
    tokenSymbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC677> {
    return super.deploy(
      initialAccount,
      initialBalance,
      tokenName,
      tokenSymbol,
      overrides || {}
    ) as Promise<ERC677>;
  }
  getDeployTransaction(
    initialAccount: string,
    initialBalance: BigNumberish,
    tokenName: string,
    tokenSymbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialAccount,
      initialBalance,
      tokenName,
      tokenSymbol,
      overrides || {}
    );
  }
  attach(address: string): ERC677 {
    return super.attach(address) as ERC677;
  }
  connect(signer: Signer): ERC677__factory {
    return super.connect(signer) as ERC677__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC677Interface {
    return new utils.Interface(_abi) as ERC677Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC677 {
    return new Contract(address, _abi, signerOrProvider) as ERC677;
  }
}
