<template>
  <div class="handle">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "Handle",
  props: {
    title: String
  }
};
</script>

<style scoped>
.handle {
  width: calc(100%-4px);
  margin: 2px 2px 0 2px;
  height: 30px;
  line-height: 30px;
  background: #2a628f;
  font-size: 15px;
  color: lightgray;
  -webkit-app-region: drag;
  text-align: center;
  font-family: "Nunito", sans-serif;
  padding: 2px;
}
</style>
