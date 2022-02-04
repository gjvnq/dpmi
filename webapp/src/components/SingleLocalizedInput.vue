<template>
  <div class="input-group single-localized-input">
    <input
      type="text"
      class="form-control"
      placeholder="Value"
      aria-label="inputVal"
      :disabled="disabled"
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
      :disabled="disabled"
      :value="lang"
      @input="updatedLang"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      :disabled="disabled"
      @click="$emit('addLine')"
    >
      +
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { LocalizedString, newLocalizedString } from "../utils";

export default defineComponent({
  name: "single-localized-input",
  props: {
    disabled: Boolean,
    modelValue: {
      type: Object as PropType<LocalizedString>,
      default(this: void): LocalizedString {
        return newLocalizedString("", "");
      },
    },
  },
  data() {
    return {val: this.modelValue as LocalizedString };
  },
  methods: {
    updatedBase(event: Event) {
      const target = event.target as HTMLInputElement;
      this.val.base = target.value;
      this.updatedModel();
    },
    updatedLang(event: Event) {
      const target = event.target as HTMLInputElement;
      this.val.lang = target.value;
      this.updatedModel();
    },
    updatedModel() {
      this.$emit("update:modelValue", this.val);
    },
  },
});
</script>

<style scoped>
#inputLang {
  max-width: 8rem;
}
</style>
