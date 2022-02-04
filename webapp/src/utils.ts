import { AppConfig } from "./config";
import ABI from "./assets/DPMIRegistry.abi.json";
import MoralisType from "moralis";
import { parse as uuidParse } from 'uuid';
import MoralisConfig from "./config/moralis";

console.log(MoralisType);

import { components } from "moralis/types/generated/web3Api";
import { AbiItem } from "web3-utils/types";
export type ApiChain = components["schemas"]["chainList"];
export type ApiAddress = string;
export type ApiParams = components["schemas"]["RunContractDto"]["params"];


import { Moralis } from "moralis/types";

export type LocalizedString = {
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

export function uuid2uint128(uuid_input: string): ArrayLike<number> {
  return uuidParse(uuid_input)
}

export async function getTokenOwner(tokenId: string): Promise<string> {
  await MoralisConfig.enableWeb3();

  const params = makeParamsContract("ownerOf", {
    tokenId: uuid2uint128(tokenId)
  });
  const result = await MoralisConfig.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  return result as unknown as string;
}

export async function addCitation(from: string, to: string): Promise<boolean> {
  await MoralisConfig.enableWeb3();

  const params = makeParamsContract("addCitation", {
    from: uuid2uint128(from),
    to: uuid2uint128(to),
  });

  const transaction = await MoralisConfig.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  console.log(transaction);
  const result = await transaction.wait();
  return true;
}