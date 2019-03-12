<template>
  <div class="contentWrapper-outer">
    <slot name="outer"></slot>
    <div class="contentWrapper-inner shadow" v-if="useInnerBox">
        <slot name="inner"></slot>
    </div>
    <slot v-else name="inner"></slot>
  </div>
</template>

<script>
  export default {
    name: "ContentWrapper",
    props: {useInnerBox: Boolean},
  };
</script>

<style scoped>
  .contentWrapper-outer {
    width: 100%;
    height: 100%;
    padding: 1.5%;
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
