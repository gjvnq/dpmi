import { AppConfig } from "./config";
import DPMI_ABI from "./assets/DPMIRegistryRandom.abi.json";
import LINK_ABI from "@chainlink/abi/v0.7/interfaces/LinkTokenInterface.json";
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

export class SmartContract {
  addr: ApiAddress;
  abi: AbiItem;

  constructor(addr: ApiAddress, abi: AbiItem) {
    this.addr = addr;
    this.abi = abi;
  }

  runFunctionAsPromise(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<MoralisTypes.ExecuteFunctionCallResult> {
    const full_params = {
      contractAddress: this.addr,
      functionName: function_name,
      abi: this.abi,
      params: params,
    };
    console.log(full_params);
    return moralis.executeFunction(full_params);
  }

  async runFunction(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<unknown> {
    const result = await this.runFunctionAsPromise(moralis, function_name, params);
    return result;
  }
}

export const DPMI_SmartContract = new SmartContract(AppConfig.DPMI_ADDRESS, DPMI_ABI as unknown as AbiItem);

export const LINK_SmartContract = new SmartContract(AppConfig.LINK_ADDRESS, LINK_ABI as unknown as AbiItem);

export function runContractFunctionPromise(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>, contractAddress?: ApiAddress): Promise<MoralisTypes.ExecuteFunctionCallResult> {
  return DPMI_SmartContract.runFunctionAsPromise(moralis, function_name, params);
}

export async function runAnyContractFunction(moralis: typeof MoralisConfig, function_name: string, params: Record<string, unknown>): Promise<unknown> {
  return DPMI_SmartContract.runFunction(moralis, function_name, params);
}
