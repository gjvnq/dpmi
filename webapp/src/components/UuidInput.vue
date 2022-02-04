<template>
  <div class="input-group single-localized-input">
    <input
      type="text"
      class="form-control"
      placeholder="UUID"
      :disabled="disabled"
      :value="modelValue"
      @input="updated"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      :disabled="disabled"
      @click="newRandom"
    >
      🎲
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: "uuid-input",
  props: {
    disabled: Boolean,
    modelValue: {
      type: String,
      default(this: void): string {
        return uuidv4();
      },
    },
  },
  data() {
    return { strVal: this.modelValue };
  },
  methods: {
    updated(event: Event) {
      const target = event.target as HTMLInputElement;
      this.strVal = target.value;
      this.updatedModel();
    },
    newRandom() {
      this.strVal = uuidv4();
      this.updatedModel();
    },
    updatedModel() {
      this.$emit("update:modelValue", this.strVal);
    },
  },
});
</script>

<style scoped>
</style>
