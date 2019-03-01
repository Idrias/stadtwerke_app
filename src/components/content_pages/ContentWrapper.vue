<template>
  <div class="contentWrapper-outer">
    <slot name="outer"></slot>
    <div class="contentWrapper-inner shadow">
        <slot name="inner"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ContentWrapper",
    props: {},
  };
</script>

<style scoped>
  .contentWrapper-outer {
    width: 100%;
    height: 100%;
    padding: 2%;
    box-sizing: border-box;
  }
  .contentWrapper-inner {
    height: 95%;
    width: 100%;
    background-color: var(--c4);
    color: var(--ct1);
    padding: 3%;
    overflow: auto;
  }
</style>
