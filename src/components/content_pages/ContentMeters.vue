<template>

    <ContentWrapper id="meters">
    
      <template #outer>
        <ButtonBar 
          v-bind:selectedCategory="selectedCategory" 
          v-on:categorySelected="handleCategorySelected">
        </ButtonBar>
      </template>

      <template #inner>
        Hello World!
      </template>

    </ContentWrapper>

</template>

<script>
import ButtonBar from "../elements/ButtonBar.vue";
import ContentWrapper from "./ContentWrapper.vue"

export default {
  name: "ContentMeters",
  props: {},
  components: {ButtonBar, ContentWrapper},
  data() {
    let el = {
      ...this.$root.$data.sharedState,
    }
    el.selectedCategory = el.categories[0];
    return el;
  },
  methods: {
    handleCategorySelected(category) {
      this.selectedCategory = category;
    }
  }
};
</script>

<style scoped></style>
