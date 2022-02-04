<template>
  <div class="container">
    <h3>Deploy Contract</h3>
    <form>
      <!-- <div class="row mb-3">
        <label for="inputTokenName" class="col-sm-2 col-form-label">Token Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="inputTokenName" v-model="tokenName">
        </div>
      </div>
      <div class="row mb-3">
        <label for="inputTokenSymbol" class="col-sm-2 col-form-label">Token Symbol</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="inputTokenSymbol" v-model="tokenSymbol">
        </div>
      </div> -->
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
      <button type="submit" class="btn btn-primary">Deploy contract</button>
    </form>
  </div>
</template>

<script lang="ts">
import Moralis from "moralis/types";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";

@Options({})
export default class DeployContract extends Vue {
  get user(): UserModel {
    return userModule.user as UserModel;
  }

  created() {
    console.log(this.$web3.eth);
    console.log(this.$web3.eth.Contract);
  }

  data() {
    return {
      estimatedCost: 0,
    }
  }
}
</script>
