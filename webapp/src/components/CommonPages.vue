<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#">DPMI</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="/me">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/token/new">Mint</a>
            </li>
          </ul>
        </div>

        <div class="d-flex" v-if="loggedIn">
          <button class="btn btn-outline-danger" @click.prevent="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <p id="header-user-indicator">Current User Id: {{ userId }}</p>
    <router-view />
  </div>
</template>

<script lang="ts">
import Moralis from "moralis/types";
import { Options, Vue } from "vue-class-component";
import { UserModel } from "../models/User";
import { userModule } from "../store/user";

@Options({})
export default class CommonPages extends Vue {
  get user(): UserModel {
    return userModule.user as UserModel;
  }

  get userId(): string {
    return this.user.id || "none";
  }

  get loggedIn(): boolean {
    return this.user.id !== undefined;
  }

  async logout(): Promise<void> {
    await this.$moralis.User.logOut();
    this.$router.push({ name: "Login" });
  }
}
</script>

<style scoped></style>
