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
