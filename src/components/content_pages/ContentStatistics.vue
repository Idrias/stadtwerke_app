<template>

<ContentWrapper id="statistics" :useInnerBox="true">
  <template #outer>
    <ButtonBar 
      :selectedCategory="selectedCategory" 
      v-on:categorySelected="handleCategorySelected"
      :categories="categories"
    />
  </template>

  <template #inner>
    <canvas id="chartCanvas" ref="chartCanvas"/>
  </template>
</ContentWrapper>

</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";
import ButtonBar from "../elements/ButtonBar.vue";
import Chart from 'chart.js';



let categories = [
  {name: "Strom"},
  {name: "Gas"},
  {name: "Wasser"},
  {name: "Abwasser"},
  {name: "Gesamt"},
  {name: "Einstellungen"},
];

export default {
  name: "ContentStatistics",
  components: {ContentWrapper, ButtonBar},
  props: {},
  data() {
    let el = {
      ...this.$root.$data.sharedState
    }
    el.categories = categories;
    el.selectedCategory = el.categories[0];
    return el;
  },

  methods: {
    handleCategorySelected(cat) {
      this.selectedCategory = cat;
    }
  },

  mounted() {
    console.log("HEY")
    console.log(this);
    var myChart = new Chart(this.$refs.chartCanvas.getContext("2d"), {
    type: 'line',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
  }

};

</script>

<style scoped>
  #chartCanvas {
    max-width: 50%;
    min-height: 80%;
  }
</style>
