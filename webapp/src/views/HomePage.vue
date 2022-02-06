<template>
  <div class="container p-3">
    <div class="card mt-5">
      <div class="card-header">
        <h6>DPMI Registration Tokens</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>UUID</th>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registration in registrations" :key="registration.hash">
                <td>{{ registration.uuid }}</td>
                <td>{{ (registration.metadata.dcTitle[0] || {base: ""}).base }}</td>
                <td><a :href="'/token/'+registration.uuid">Edit</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="text-align: center"><a href="/token/new">New registration</a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Moralis from "moralis/types";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";
import { DPMIRegistration } from "../models/DPMIRegistration";

@Options({})
export default class HomePage extends Vue {
  registrations: Array<DPMIRegistration> = [];

  get user(): UserModel {
    return userModule.user as UserModel;
  }

  get userEthAddress(): string {
    return this.user.get('ethAddress');
  }

  async created() {
    await this.$moralis.enableWeb3();
    await this.fetchData();
  }

  async fetchData(): Promise<void> {
    console.log(this.userEthAddress);
    this.registrations = await DPMIRegistration.load_by_owner(this.userEthAddress, true, this.$moralis);
  }

  // async fetchTransactions(): Promise<void> {
  //   const transactions: Moralis.TransactionResult[] = (
  //     await this.$moralis.Web3API.account.getTransactions({
  //       chain: "rinkeby",
  //       address: this.user.attributes.ethAddress,
  //     })
  //   ).result as Moralis.TransactionResult[];

  //   this.transactions = transactions;
  // }

  // fromWei(value: string): number {
  //   return this.$moralis.Units.FromWei(value, 18);
  // }
}
</script>
