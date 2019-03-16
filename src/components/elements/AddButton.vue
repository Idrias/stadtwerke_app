<template>
  <div id="btn" v-on:click="$emit('click')">+</div>
</template>

<script>
export default {
  name: "AddButton",
  props: {}
};
</script>

<style scoped>
#btn {
  margin-top: 15px;
  border: 1px solid;
  border-radius: 35%;
  width: 38px;
  height: 38px;
  display: inline-grid;
  align-content: center;
  background-color: var(--c3);
}

#btn:hover {
  background-color: var(--c4);
  cursor: pointer;
}
</style>
