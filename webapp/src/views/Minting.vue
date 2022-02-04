<template>
  <div class="container">
    <h3>Minting</h3>
    <form>
      <div class="row mb-3">
        <label for="outputContractAddr" class="col-sm-2 col-form-label">Contract Addr</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="outputContractAddr" v-bind:value="contract_addr">
        </div>
      </div>
      <div class="row mb-3">
        <label for="outputOwner" class="col-sm-2 col-form-label">Owner</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="outputOwner" v-bind:value="user.get('ethAddress')">
        </div>
      </div>
      <div class="row mb-3">
        <label for="outputDeployCost" class="col-sm-2 col-form-label">Estimated Cost</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="outputDeployCost" v-model="estimatedCost">
        </div>
      </div>
      <h4>Dublin Core</h4>
      <localized-input label="Title" v-model="dcTitle" />

      <button type="submit" class="btn btn-primary" @click.prevent="deploy">Deploy contract</button>
    </form>
  </div>
</template>

<script lang="ts">
import { AppConfig } from "../config";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";
import { makeParamsContract } from "../utils";
import MoralisType from "moralis";

import { components } from "moralis/types/generated/web3Api";

@Options({})
export default class Minting extends Vue {
  get user(): UserModel {
    return userModule.user as UserModel;
  }

  get contract_addr() {
    // console.log(LocalizedInput);
    return AppConfig.DPMI_ADDRESS;
  }

  async deploy() {
    // console.log(components);
    // console.log(MoralisType);
    // console.log(MoralisType.prototype);
    // console.log(MoralisType.Web3API.native.runContractFunction);
    // console.log(typeof MoralisType.Web3API["account"]["getNativeBalance"]);
    // console.log(typeof MoralisType.Web3API["native"]["runContractFunction"]);
    // console.log(this.$moralis.Web3API.native);
    const params = makeParamsContract("safeMint", {
      to: this.user.get('ethAddress'),
      tokenId: 1,
      uri: "example.com",
    });
    const allowance = await this.$moralis.executeFunction(params);
    console.log(allowance);
  }

  created() {
    this.$moralis.enableWeb3();
  }

  data() {
    return {
      estimatedCost: 0,
      dcTitle: [],
    }
  }
}
</script>
