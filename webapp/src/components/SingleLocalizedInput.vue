<template>
  <div class="input-group single-localized-input">
    <input
      :type="inputType"
      v-if="inputTypeCommon"
      :class="{'form-control': !readonly, 'form-control-plaintext': readonly}"
      placeholder="Value"
      aria-label="inputVal"
      :readonly="readonly"
      :disabled="disabled"
      :value="val.base"
      @input="updatedBase"
    />
    <textarea
      ref="textarea"
      :type="inputType"
      v-if="inputType == 'textarea'"
      :class="{'form-control': !readonly, 'form-control-plaintext': readonly}"
      placeholder="Value"
      aria-label="inputVal"
      :readonly="readonly"
      :disabled="disabled"
      :value="val.base"
      @input="updatedBase"
    ></textarea>
    <span
      :class="{'input-group-text': !readonly, 'input-group-plaintext': readonly}"
    > in </span>
    <input
      type="text"
      :class="{'form-control': !readonly, 'form-control-plaintext': readonly}"
      placeholder="Language"
      aria-label="Language"
      list="languages"
      id="inputLang"
      :readonly="readonly"
      :disabled="disabled"
      :value="val.lang"
      @input="updatedLang"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      v-if="!readonly"
      :disabled="disabled || readonly"
      @click="$emit('addLine')"
    >
      +
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, isReactive } from "vue";
import { LocalizedString, newLocalizedString } from "../utils";

export default defineComponent({
  name: "single-localized-input",
  props: {
    disabled: Boolean,
    readonly: Boolean,
    inputType: {
      type: String,
      default: "text",
    },
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
  updated() {
    this.textareaAdjust();
  },
  mounted() {
    this.textareaAdjust();
  },
  computed: {
    inputTypeCommon(): boolean {
      return this.inputType != "textarea" &&  this.inputType != "select";
    },
  },
  methods: {
    textareaAdjust() {
      if (this.inputType == 'textarea') {
        const elem = this.$refs.textarea as HTMLTextAreaElement;
        while (elem.clientHeight < elem.scrollHeight && elem.rows < 30) {
          elem.rows += 1;
        }
      }
    },
    textareaReset() {
      if (this.inputType == 'textarea') {
        const elem = this.$refs.textarea as HTMLTextAreaElement;
        elem.rows = 1;
      }
    },
    updatedBase(event: Event) {
      const target = event.target as HTMLInputElement;
      this.val.base = target.value;
      this.textareaAdjust();
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
