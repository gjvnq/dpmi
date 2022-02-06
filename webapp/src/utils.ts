import { AppConfig } from "./config";
import ABI from "./assets/DPMIRegistry.abi.json";
import { parse as uuidParse, stringify as uuidStringify, NIL as NIL_UUID } from 'uuid';
import { BigNumber } from "@ethersproject/bignumber";
import MoralisConfig from "./config/moralis";

import { Moralis as MoralisTypes } from "moralis/types";
import { AbiItem } from "web3-utils/types";
import { components as web3Api_components } from "moralis/types/generated/web3Api";
import { operations as web3Api_operations } from "moralis/types/generated/web3Api";
export type ApiChain = web3Api_components["schemas"]["chainList"];
export type ApiAddress = string;
export type ApiParams = web3Api_components["schemas"]["RunContractDto"]["params"];
export type MoralisTokenMetadata = web3Api_operations["getTokenMetadata"]["responses"]["200"]["content"]["application/json"];

export class LocalizedString {
  base = "";
  lang = "";

  constructor(base: string, lang: string) {
    this.base = base;
    this.lang = lang;
  }

  get length(): number {
    return this.base.length + this.lang.length;
  }
}

export function newLocalizedString(
  base: string,
  lang: string
): LocalizedString {
  return new LocalizedString("", "");
}

export interface ApiContractParams {
  chain: ApiChain,
  address: ApiAddress,
  function_name: string,
  abi: AbiItem;
  params: ApiParams;
}

export function makeParamsContract(
  function_name: string,
  params: Record<string, unknown>
): MoralisTypes.ExecuteFunctionOptions {
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

export function uuid2bignum(uuid_input: string): BigNumber {
  const hex = "0x"+uuid_input.replaceAll("-", "");
  return BigNumber.from(hex);
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

export function runContractFunctionPromise(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<MoralisTypes.ExecuteFunctionCallResult> {
  const full_params = {
    contractAddress: AppConfig.DPMI_ADDRESS,
    functionName: function_name,
    abi: ABI as unknown as AbiItem,
    params: params,
  };
  return moralis.executeFunction(full_params);
}

export async function runAnyContractFunction(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<unknown> {
  const result = await runContractFunctionPromise(moralis, function_name, params);
  // console.log("runAnyContractFunction(function_name='"+function_name+"')", result);
  return result;
}

// NOT WORKING!!!
export async function runViewContractFunction(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<unknown> {
  const full_params = {
    contractAddress: AppConfig.DPMI_ADDRESS,
    function_name: function_name,
    abi: ABI as unknown as AbiItem,
    chain: AppConfig.CHAIN,
    params: params,
  };
  console.log("runViewContractFunction", full_params);
  const result = await moralis.Web3API.native.runContractFunction(full_params);
  console.log("runViewContractFunction", result);
  return result;
}

export async function mintToken(to: string, tokenId: string, uri: string, moralis: typeof MoralisConfig): Promise<string> {
  const params = makeParamsContract("safeMint", {
    to: to,
    tokenId: uuid2uint128(tokenId),
    uri: uri,
  });
  const transaction = await moralis.executeFunction(params) as MoralisTypes.ExecuteFunctionCallResult;
  console.log("mintToken->transaction", transaction);
  const result = await transaction.wait();
  console.log("mintToken->result", result);
  return tokenId;
}

export async function getTokenOwner(tokenId: string, moralis: typeof MoralisConfig): Promise<string> {
  const params = makeParamsContract("ownerOf", {
    tokenId: uuid2uint128(tokenId)
  });
  const result = await moralis.executeFunction(params) as MoralisTypes.ExecuteFunctionCallResult;
  return result as unknown as string;
}

export async function addCitation(from: string, to: string, moralis: typeof MoralisConfig): Promise<boolean> {
  const params = makeParamsContract("addCitation", {
    fromToken: uuid2uint128(from),
    toToken: uuid2uint128(to),
  });

  const transaction = await moralis.executeFunction(params) as MoralisTypes.ExecuteFunctionCallResult;
  console.log("addCitation->transaction", transaction);
  const result = await transaction.wait();
  console.log("addCitation->result", result);
  return true;
}

export async function getCites(tokenId: string, moralis: typeof MoralisConfig): Promise<Array<string>> {
  const params = makeParamsContract("getCites", {
    tokenId: uuid2uint128(tokenId),
  });

  const result = await moralis.executeFunction(params) as MoralisTypes.ExecuteFunctionCallResult;
  const result2 = result as Array<BigNumber>;
  const result3 = result2.map(bignum2uuid);
  return result3 as Array<string>;
}

export async function getCitedBy(tokenId: string, moralis: typeof MoralisConfig): Promise<Array<string>> {
  const params = makeParamsContract("getCitedBy", {
    tokenId: uuid2uint128(tokenId),
  });

  const result = await moralis.executeFunction(params) as MoralisTypes.ExecuteFunctionCallResult;
  const result2 = result as Array<BigNumber>;
  const result3 = result2.map(bignum2uuid);
  return result3 as Array<string>;
}