<template>
  <div class="container">
    <h3>Minting</h3>
    <form>
      <!-- <div class="row mb-3">
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
      </div> -->
      <h4>Basic Info</h4>
      <div class="row mb-3">
        <label for="inputTokenId" class="col-sm-2 col-form-label">Token Id</label>
        <div class="col-sm-10">
          <uuid-input ref="uuidChild" v-model="tokenUuid" :disabled="disabled"/>
        </div>
      </div>
      <h4>Dublin Core</h4>
      <localized-input label="Title" v-model="dcTitle"  :disabled="disabled"/>

      <button type="submit" class="btn btn-primary" @click.prevent="deploy" :disabled="disabled">Deploy contract</button>
    </form>
  </div>
</template>

<script lang="ts">
import { AppConfig } from "../config";
import { defineComponent, Ref } from 'vue';
import { UserModel } from "../models/User";
import { userModule } from "../store/user";
import { makeParamsContract, uuid2uint128 } from "../utils";
import { Moralis } from "moralis/types";
import UuidInput from "../components/UuidInput.vue";

import { components } from "moralis/types/generated/web3Api";

export default defineComponent({
  data() {
    return {
      tokenUuid: "" as string,
      dcTitle: [],
      disabled: false,
    }
  },
  created() {
    this.$moralis.enableWeb3();
  },
  mounted() {
    const uuidChild = this.$refs.uuidChild as typeof UuidInput;
    uuidChild.newRandom();
  },
  computed: {
    user(): UserModel {
      return userModule.user as UserModel;
    },
    tokenId(): ArrayLike<number> {
      return uuid2uint128(this.tokenUuid);
    },
  },
  methods: {
    async deploy() {
      try {
        this.disabled = true;
        console.log(this.tokenId);
        const final_path = "/token/"+this.tokenUuid;
        console.log(final_path);
        const params = makeParamsContract("safeMint", {
          to: this.user.get('ethAddress'),
          tokenId: this.tokenId,
          uri: "example.com",
        });
        const transaction = await this.$moralis.executeFunction(params) as Moralis.ExecuteFunctionCallResult;
        console.log(transaction);
        const result = await transaction.wait();
        console.log(result);
        // redirect to propper page
        window.location.pathname = final_path;
      } finally {
        this.disabled = false;
      }
    }
  },
});

// @Options({})
// export default class Minting extends Vue {

//   get contract_addr() {
//     return AppConfig.DPMI_ADDRESS;
//   }


// }
</script>
