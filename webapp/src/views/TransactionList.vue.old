<template>
  <div class="container p-3">
    <div class="card mt-5">
      <div class="card-header">
        <h6>Transactions</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>From Address</th>
                <th>To Address</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.hash">
                <td>{{ transaction.hash }}</td>
                <td>{{ transaction.from_address }}</td>
                <td>{{ transaction.to_address }}</td>
                <td>{{ transaction.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Moralis from "moralis/types";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";

@Options({})
export default class TransactionList extends Vue {
  transactions: Moralis.TransactionResult[] = [];
  get user(): UserModel {
    return userModule.user as UserModel;
  }

  created(): void {
    this.fetchTransactions();
  }

  async fetchTransactions(): Promise<void> {
    const transactions: Moralis.TransactionResult[] = (
      await this.$moralis.Web3API.account.getTransactions({
        chain: "rinkeby",
        address: this.user.attributes.ethAddress,
      })
    ).result as Moralis.TransactionResult[];

    this.transactions = transactions;
  }

  fromWei(value: string): number {
    return this.$moralis.Units.FromWei(value, 18);
  }
}
</script>
