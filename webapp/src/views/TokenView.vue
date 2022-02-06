<template>
  <div class="container">
    <form action="#">
      <h3 v-if="isNew">New DPMI Record</h3>
      <h3 v-if="!isNew">DPMI Record</h3>
      <div class="row mb-3" v-if="!isNew">
        <label for="tokenUuid" class="col-sm-2 col-form-label">UUID</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="tokenUuid" v-bind:value="registration.uuid">
        </div>
      </div>
      <div class="row mb-3">
        <label for="tokenOwner" class="col-sm-2 col-form-label">Owner</label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="tokenOwner" v-bind:value="registration.owner">
        </div>
      </div>
      <div class="row mb-3" v-if="!isNew">
        <label for="tokenURI" class="col-sm-2 col-form-label">Token URI (for metadata)</label>
        <div class="col-sm-10">
          <textarea readonly class="form-control-plaintext" id="tokenURI" v-model="registration.metadata_url"></textarea>
        </div>
      </div>
      <h4>Dublin Core</h4>
      <localized-input label="Title" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcTitle.length > 0 || canEdit)" v-model="regmd.dcTitle"/>
      <div class="row mb-3" v-if="regmd_ok && (regmd.dcDate.length > 0 || canEdit)">
        <label class="col-sm-2 col-form-label">Date</label>
        <div class="col-sm-10">
          <input
            type="text"
            :class="{'form-control': canEdit, 'form-control-plaintext': !canEdit}"
            placeholder="Use ISO8601"
            v-model="regmd.dcDate"
            :disabled="disabled"
            :readonly="!canEdit"
          />
        </div>
      </div>
      <localized-input label="Creator" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcCreator.length > 0 || canEdit)" v-model="regmd.dcCreator"/>
      <localized-input label="Contributor" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcContributor.length > 0 || canEdit)" v-model="regmd.dcContributor"/>
      <localized-input label="Format" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcFormat.length > 0 || canEdit)" v-model="regmd.dcFormat"/>
      <div class="row mb-3" v-if="regmd_ok && (regmd_langs.length > 0 || canEdit)">
        <label class="col-sm-2 col-form-label" for="dcLanguage">Language</label>
        <div class="col-sm-10">
          <input
            id="dcLanguage"
            type="text"
            :class="{'form-control': canEdit, 'form-control-plaintext': !canEdit}"
            placeholder="Comma separated"
            v-model="regmd_langs"
            :disabled="disabled"
            :readonly="!canEdit"
          />
        </div>
      </div>
      <localized-input inputType="textarea" label="Description" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcDescription.length > 0 || canEdit)" v-model="regmd.dcDescription"/>
      <localized-input label="Subject" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcSubject.length > 0 || canEdit)" v-model="regmd.dcSubject"/>
      <localized-input label="Coverage" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcCoverage.length > 0 || canEdit)" v-model="regmd.dcCoverage"/>
      <localized-input label="Publisher" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcPublisher.length > 0 || canEdit)" v-model="regmd.dcPublisher"/>
      <localized-input label="Rights" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcRights.length > 0 || canEdit)" v-model="regmd.dcRights"/>
      <localized-input label="Source" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcSource.length > 0 || canEdit)" v-model="regmd.dcSource"/>
      <localized-input label="Identifier" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcIdentifier.length > 0 || canEdit)" v-model="regmd.dcIdentifier"/>
      <localized-input label="Relation" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcRelation.length > 0 || canEdit)" v-model="regmd.dcRelation"/>
      <localized-input label="Type" :readonly="!canEdit" :disabled="disabled" v-if="regmd_ok && (regmd.dcType.length > 0 || canEdit)" v-model="regmd.dcType"/>
       <div class="row mb-3" v-if="canEdit">
        <span class="col-sm-5"></span>
        <button
          class="btn btn-outline-primary col-sm-2"
          type="button"
          :disabled="disabled"
          @click="saveMetadata"
        >
          Save changes
        </button>
      </div>
      <h4>Cites</h4>
      <div class="row mb-3" _v-if="registration.fwd_citations.length > 0">
        <span class="col-sm-2"></span>
        <ul class="list-unstyled col-sm-10">
          <template v-for="(addr, i) in registration.fwd_citations" :key="i">
            <li><a :href="'/token/'+addr">{{addr}}</a></li>
          </template>
        </ul>
      </div>
      <div class="row mb-3" v-if="canEdit">
        <span class="col-sm-2"></span>
        <div class="col-sm-10">
          <div class="input-group">
            <input type="text" class="form-control" id="newCite" placeholder="DPMI of the cited work" v-model="newCitesUuid" :disabled="disabled || isNew">
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="disabled || isNew"
              @click="addCites"
            >
              Add citation
            </button>
          </div>
        </div>
      </div>
      <h4>Cited By</h4>
      <div class="row mb-3" _v-if="citedBy.length > 0">
        <span class="col-sm-2"></span>
        <ul class="list-unstyled col-sm-10">
          <template v-for="(addr, i) in registration.rev_citations" :key="i">
            <li><a :href="'/token/'+addr">{{addr}}</a></li>
          </template>
        </ul>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { AppConfig } from "../config";
import { defineComponent, Ref } from 'vue';
import { UserModel } from "../models/User";
import { DPMIRegistration, NullDPMIRegistration, DPMIMetadata } from "../models/DPMIRegistration";
import { userModule } from "../store/user";
import { makeParamsContract, uuid2uint128, getTokenOwner, addCitation, getCites, getCitedBy } from "../utils";
import { Moralis } from "moralis/types";
import UuidInput from "../components/UuidInput.vue";

import { components } from "moralis/types/generated/web3Api";

export default defineComponent({
  data() {
    return {
      regmd_ok: false,
      registration: NullDPMIRegistration,
      processingChange: false,
      newCitesUuid: "" as string,
    }
  },
  computed: {
    regmd(): DPMIMetadata {
      return this.registration.metadata;
    },
    regmd_langs: {
      get(): string {
        return this.regmd.dcLanguage.join(", ");
      },
      set(val: string) {
        this.regmd.dcLanguage = val.split(",");
      }
    },
    disabled(): boolean {
      return this.canEdit && this.processingChange;
    },
    canEdit(): boolean {
      return this.isOwner || this.isOperator;
    },
    isOwner(): boolean {
      return this.isNew || this.registration.owner.toLowerCase() == this.userEthAddress;
    },
    isOperator(): boolean {
      return false;
    },
    isNew(): boolean {
      return this.$route.params.uuid == "new";
    },
    user(): UserModel {
      return userModule.user as UserModel;
    },
    userEthAddress(): string {
      try {
        return this.user.get('ethAddress');
      } catch (e) {
        return "";
      }
    },
  },
  // react to route changes...
  async beforeRouteUpdate(to, from) {
    console.log(to, from);
    const tokenUuid = to.params.uuid as string;
    await this.fetchData(tokenUuid);
  },
  async mounted() {
    const tokenUuid = this.$route.params.uuid as string;
    await this.$moralis.enableWeb3();
    await this.fetchData(tokenUuid);
  },
  methods: {
    async fetchData(tokenUuid: string) {
      try {
        this.processingChange = true;
        this.registration = await DPMIRegistration.load_or_new(tokenUuid, this.userEthAddress, this.$moralis);
        await this.registration.load_metadata();
        const old = this.registration;
        this.registration = old;
        this.regmd_ok = true;
      } finally {
        this.processingChange = false;
      }
    },
    async addCites() {
      try {
        this.processingChange = true;
        await this.registration.addCitation(this.newCitesUuid.trim(), this.$moralis);
        this.newCitesUuid = "";
      } finally {
        this.processingChange = false;
      }
    },
    async saveMetadata() {
      try {
        this.processingChange = true;
        console.log(this.regmd);
        await this.registration.save_metadata(this.$moralis);
        alert("Saved new metadata");

        if (this.isNew) {
          const final_path = "/token/"+this.registration.uuid;
          console.log("Redirecting to", final_path);
          window.location.pathname = final_path;
        }
      } finally {
        this.processingChange = false;
      }
    },
  },
});
</script>
