import { AppConfig } from "./config";
import ABI from "./assets/DPMIRegistry.abi.json";
import { parse as uuidParse, stringify as uuidStringify, NIL as NIL_UUID } from 'uuid';
// import { BigNumber } from "moralis";
import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import MoralisConfig from "./config/moralis";

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

export function bignum2uuid(input: BigNumber): string {
  const core = input.toHexString().substr(2, 32);
  const block1 = core.substr(0,   8);
  const block2 = core.substr(8,   4);
  const block3 = core.substr(12,  4);
  const block4 = core.substr(16,  4);
  const block5 = core.substr(20, 12);
  return block1+"-"+block2+"-"+block3+"-"+block4+"-"+block5;
}

export async function mintToken(to: string, tokenId: string, uri: string, moralis: typeof MoralisConfig): Promise<string> {
  const params = makeParamsContract("safeMint", {
    to: to,
    tokenId: uuid2uint128(tokenId),
    uri: uri,
  });
  const transaction = await moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  console.log("mintToken->transaction", transaction);
  const result = await transaction.wait();
  console.log("mintToken->result", result);
  return tokenId;
}

export async function getTokenOwner(tokenId: string, moralis: typeof MoralisConfig): Promise<string> {
  const params = makeParamsContract("ownerOf", {
    tokenId: uuid2uint128(tokenId)
  });
  const result = await moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  return result as unknown as string;
}

export async function addCitation(from: string, to: string, moralis: typeof MoralisConfig): Promise<boolean> {
  const params = makeParamsContract("addCitation", {
    fromToken: uuid2uint128(from),
    toToken: uuid2uint128(to),
  });

  const transaction = await moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  console.log("addCitation->transaction", transaction);
  const result = await transaction.wait();
  console.log("addCitation->result", result);
  return true;
}

export async function getCites(tokenId: string, moralis: typeof MoralisConfig): Promise<Array<string>> {
  const params = makeParamsContract("getCites", {
    tokenId: uuid2uint128(tokenId),
  });

  const result = await moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  const result2 = result as Array<BigNumber>;
  const result3 = result2.map(bignum2uuid);
  return result3 as Array<string>;
}

export async function getCitedBy(tokenId: string, moralis: typeof MoralisConfig): Promise<Array<string>> {
  const params = makeParamsContract("getCitedBy", {
    tokenId: uuid2uint128(tokenId),
  });

  const result = await moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
  const result2 = result as Array<BigNumber>;
  const result3 = result2.map(bignum2uuid);
  return result3 as Array<string>;
}