<template>

    <ContentWrapper id="meters" :useInnerBox="true">
    
      <template #outer>
        <ButtonBar 
          v-bind:selectedCategory="selectedCategory" 
          v-on:categorySelected="handleCategorySelected">
        </ButtonBar>
      </template>

      <template #inner>

      <div id="test" class="shadow">
        <h2>Zählerauswahl</h2><br>
        
        <table style>
          <tr>
            <th> Zählernummer </th>
            <th> Bemerkung </th>
          </tr>

          <tr><td>0312421</td><td>EG</td></tr>
          <tr><td>0312421</td><td>EG</td></tr>
          <tr><td>0312421</td><td>EG</td></tr>
        </table>
        
      </div>

      <div id="readings" class="shadow">
        <h2>Ablesungen</h2><br>
        <table>
          
          <tr>
            <th> Datum </th>
            <th> Zählerstand </th>
            <th> Bemerkung </th>
          </tr>
        </table>
      </div>


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

<style scoped>

#test {
  width: 100%;
  grid-row: 1;
  grid-column: 1;
  background-color: var(--c3);
  justify-self: center;
  padding: 30px;
}

#readings {
  width: 100%;
  min-width: 100%;
  background-color: var(--c3);
  padding: 30px;
  justify-self: center;
}

table {
  width: 100%;  
}

</style>
