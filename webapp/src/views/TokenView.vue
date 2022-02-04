<template>
  <div class="container">
    <form action="#">
      <h3>DPMI Record</h3>
      <div class="row mb-3">
        <label for="tokenUuid" class="col-sm-2 col-form-label">UUID</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="tokenUuid" v-bind:value="tokenUuid">
        </div>
      </div>
      <div class="row mb-3">
        <label for="tokenOwner" class="col-sm-2 col-form-label">Owner</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="tokenOwner" v-bind:value="owner">
        </div>
      </div>
      <h4>Dublin Core</h4>
      <localized-input label="Title" v-model="dcTitle" readonly=true v-if="dcTitle.length > 0"/>
      <h4>Cites</h4>
      <div class="row mb-3" v-if="cites.length > 0">
        <span class="col-sm-2"></span>
        <ul class="list-unstyled col-sm-10">
          <template v-for="(addr, i) in cites" :key="i">
            <li><a :href="'/token/'+addr">{{addr}}</a></li>
          </template>
        </ul>
      </div>
      <div class="row mb-3">
        <span class="col-sm-2"></span>
        <div class="col-sm-10">
          <div class="input-group">
            <input type="text" class="form-control" id="newCite" placeholder="DPMI of the cited work" v-model="newCitesUuid">
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="disabled"
              @click="addCites"
            >
              Add citation
            </button>
          </div>
        </div>
      </div>
      <h4>Cited By</h4>
      <div class="row mb-3" v-if="citedBy.length > 0">
        <span class="col-sm-2"></span>
        <ul class="list-unstyled col-sm-10">
          <template v-for="(addr, i) in citedBy" :key="i">
            <li><a :href="'/token/'+addr">{{addr}}</a></li>
          </template>
        </ul>
      </div>
      <div class="row mb-3">
        <span class="col-sm-2"></span>
        <div class="col-sm-10">
          <div class="input-group">
            <input type="text" class="form-control" id="newCitedBy" placeholder="DPMI of the citing work" v-model="newCitedByUuid">
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="disabled"
              @click="addCitedBy"
            >
              Add citing work
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { AppConfig } from "../config";
import { defineComponent, Ref } from 'vue';
import { UserModel } from "../models/User";
import { userModule } from "../store/user";
import { makeParamsContract, uuid2uint128, getTokenOwner, addCitation } from "../utils";
import { Moralis } from "moralis/types";
import UuidInput from "../components/UuidInput.vue";

import { components } from "moralis/types/generated/web3Api";

export default defineComponent({
  data() {
    return {
      disabled: false,
      tokenUuid: "" as string,
      owner: "" as string,
      newCitesUuid: "" as string,
      newCitedByUuid: "" as string,
      dcTitle: [],
      cites: [],
      citedBy: [],
    }
  },
  computed: {
    user(): UserModel {
      return userModule.user as UserModel;
    },
  },
  // react to route changes...
  async beforeRouteUpdate(to, from) {
    console.log(to, from);
    const tokenUuid = to.params.uuid as string;
    await this.fetchData(tokenUuid);
  },
  async mounted() {
    console.log(this.$route.params);
    const tokenUuid = this.$route.params.uuid as string;
    await this.fetchData(tokenUuid);
  },
  methods: {
    async fetchData(tokenUuid: string) {
      this.tokenUuid = tokenUuid;
      this.owner = await getTokenOwner(tokenUuid);
      // this.operators = await getTokenOperators(tokenUuid);
    },
    async addCites() {
      try {
        this.disabled = true;
        console.log("addCites", this.newCitesUuid);
        await addCitation(this.tokenUuid, this.newCitesUuid);
      } finally {
        this.disabled = false;
      }
    },
    async addCitedBy() {
      try {
        this.disabled = true;
        await addCitation(this.newCitedByUuid, this.tokenUuid);
      } finally {
        this.disabled = false;
      }
    },
  },
});
</script>
