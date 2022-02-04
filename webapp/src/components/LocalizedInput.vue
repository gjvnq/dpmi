<template>
  <div>
    <div class="row mb-3">
      <label for="inputVal" class="col-sm-2 col-form-label">Title</label>
      <div class="col-sm-10">
        <template v-for="(line, i) in lines" :key="i">
          <single-localized-input
            v-model="lines[i]"
            @addLine="addLine"
            @change="update"
          />
        </template>
      </div>
    </div>
    <datalist id="languages">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="pt">Português</option>
      <option value="en-US">English (US)</option>
      <option value="en-UK">English (UK)</option>
      <option value="pt-BR">Português (Brasil)</option>
      <option value="pt-PT">Português (Portugal)</option>
    </datalist>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LocalizedString, newLocalizedString } from "../utils";

export default defineComponent({
  name: "localized-input",
  props: {
    modelValue: {
      type: Array,
      validator(this: void, value: Array<LocalizedString>): boolean {
        return value.length > 0;
      },
      default(this: void): Array<LocalizedString> {
        return [newLocalizedString("", "")];
      },
    },
  },
  data() {
    return { lines: this.modelValue as Array<LocalizedString> };
  },
  methods: {
    addLine() {
      console.log(this);
      console.log(this.lines);
      this.lines.push(newLocalizedString("", ""));
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
