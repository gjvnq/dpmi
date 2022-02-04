<template>
  <h1>{{ msg }}!!</h1>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "TestComponent",
  props: {
    msg: String,
  },
});
</script>

<style scoped>
</style>