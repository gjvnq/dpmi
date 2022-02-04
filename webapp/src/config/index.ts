import * as env from "env-var";

export class AppConfig {
  static MORALIS_APPID: string = env
    .get("VUE_APP_MORALIS_APPID")
    .asString() as string;
  static MORALIS_SERVER_URL: string = env
    .get("VUE_APP_MORALIS_SERVER_URL")
    .asString() as string;
  static DPMI_ADDRESS: string = env
    .get("VUE_APP_DPMI_ADDRESS")
    .asString() as string;
}
