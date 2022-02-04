import * as env from "env-var";

import { components } from "moralis/types/generated/web3Api";
export type ApiChain = components["schemas"]["chainList"];

export class AppConfig {
  static MORALIS_APPID: string = env
    .get("VUE_APP_MORALIS_APPID")
    .asString() as string;
  static MORALIS_SERVER_URL: string = env
    .get("VUE_APP_MORALIS_SERVER_URL")
    .asString() as string;
  static CHAIN: ApiChain = env
    .get("VUE_APP_CHAIN")
    .asString() as ApiChain;
  static DPMI_ADDRESS: string = env
    .get("VUE_APP_DPMI_ADDRESS")
    .asString() as string;
}
