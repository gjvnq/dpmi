<template>
  <div class="row mb-3">
    <label id="inputVal" class="col-sm-2 col-form-label">{{ label }}</label>
    <div class="col-sm-10">
      <template v-for="(line, i) in lines" :key="i">
        <div class="input-group single-localized-input">
        <input
          type="text"
          :class="{'form-control': !readonly, 'form-control-plaintext': readonly}"
          placeholder="Value"
          aria-label="inputVal"
          :readonly="readonly"
          :disabled="disabled"
          v-model="line[i]"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          v-if="!readonly"
          :disabled="disabled || readonly"
          @click="addLine"
        >
          +
        </button>
      </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "multi-input",
  props: {
    disabled: Boolean,
    readonly: Boolean,
    label: {
      type: String,
      default(this: void) {
        return "Label"
      },
    },
    modelValue: {
      type: Array,
      default(this: void): Array<string> {
        return [""];
      },
    },
  },
  data() {
    return { lines: this.modelValue as Array<string> };
  },
  created() {
    if (this.lines.length == 0) {
      this.addLine();
    }
  },
  methods: {
    addLine() {
      this.lines.push("");
      this.update();
    },
    update() {
      this.$emit("update:modelValue", this.lines);
    },
  },
});
</script>

<style scoped>
.single-localized-input {
  padding-bottom: 1rem;
}
.single-localized-input:last-child {
  padding-bottom: 0;
}
</style>
