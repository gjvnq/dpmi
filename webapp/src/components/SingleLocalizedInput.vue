<template>
  <div class="input-group single-localized-input">
    <input
      type="text"
      class="form-control"
      placeholder="Value"
      aria-label="inputVal"
      :value="base"
      @input="updatedBase"
    />
    <span class="input-group-text"> in </span>
    <input
      type="text"
      class="form-control"
      placeholder="Language"
      aria-label="Language"
      list="languages"
      id="inputLang"
      :value="lang"
      @input="updatedLang"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="$emit('addLine')"
    >
      +
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "single-localized-input",
  props: ["modelValue"],
  data() {
    return { base: this.modelValue.base, lang: this.modelValue.lang };
  },
  methods: {
    updatedBase(event: Event) {
      const target = event.target as HTMLInputElement;
      this.base = target.value;
      this.updatedModel();
    },
    updatedLang(event: Event) {
      const target = event.target as HTMLInputElement;
      this.lang = target.value;
      this.updatedModel();
    },
    updatedModel() {
      this.$emit("update:modelValue", { base: this.base, lang: this.lang });
    },
  },
});
</script>

<style scoped>
#inputLang {
  max-width: 8rem;
}
</style>
