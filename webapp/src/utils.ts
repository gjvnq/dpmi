import { AppConfig } from "./config";
import ABI from "./assets/DPMIRegistry.abi.json";
import MoralisType from "moralis";

console.log(MoralisType);

import { components } from "moralis/types/generated/web3Api";
import { AbiItem } from "web3-utils/types";
export type ApiChain = components["schemas"]["chainList"];
export type ApiAddress = string;
export type ApiParams = components["schemas"]["RunContractDto"]["params"];


import { Moralis } from "moralis/types";

export interface LocalizedString {
  base: string;
  lang: string;
}

export function newLocalizedString(
  base: string,
  lang: string
): LocalizedString {
  return {
    base: base,
    lang: lang,
  };
}

// export interface ContractParamsInterface {
//   chain?: "eth" | "0x1" | "ropsten" | "0x3" | "rinkeby" | "0x4" | "goerli" | "0x5" | "kovan" | "0x2a" | "polygon" | "0x89" | "mumbai" | "0x13881" | "bsc" | "0x38" | "bsc testnet" | "0x61" | "avalanche" | "0xa86a" | string;
//   function_name: string;
// }

export interface ApiContractParams {
  chain: ApiChain,
  address: ApiAddress,
  function_name: string,
  abi: AbiItem;
  params: ApiParams;
}

// export function makeParamsContract(
//   function_name: string,
//   params: Record<string, unknown>
// ): ApiContractParams {
//   return {
//     chain: AppConfig.CHAIN,
//     address: AppConfig.DPMI_ADDRESS,
//     function_name: function_name,
//     abi: ABI as unknown as AbiItem,
//     params: params,
//   };
// }

export function makeParamsContract(
  function_name: string,
  params: Record<string, unknown>
): Moralis.ExecuteFunctionOptions {
  return {
    contractAddress: AppConfig.DPMI_ADDRESS,
    functionName: function_name,
    abi: ABI as unknown as AbiItem,
    params: params,
  };
}


