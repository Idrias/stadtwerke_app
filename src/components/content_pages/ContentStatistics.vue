<template>
  <ContentWrapper id="statistics" :useInnerBox="false">
    <template #outer>
      <ButtonBar
        v-bind:selectedCategory="selectedCategory"
        v-bind:categories="getCategories()"
        v-on:categorySelected="handleCategorySelected"
      ></ButtonBar>
    </template>

    <template #inner>
      <div class="gridContainer">
        <div id="metersContainer" class="shadow">
          <h2>Zählerauswahl</h2>
          <br />
          <table v-if="getMeters().length > 0" id="metersTable">
            <tr>
              <th>Zählernummer</th>
              <th>Bemerkung</th>
              <!--<th> </th>-->
            </tr>
            <tr
              v-for="meter of getMeters()"
              v-bind:key="meter.uuid"
              v-on:click="selectMeter(meter)"
              v-bind:class="{ selected: meter === selectedMeter }"
              @contextmenu="$refs.addMeter.openForChange(meter)"
            >
              <td>{{ meter.mid }}</td>
              <td>{{ meter.comment }}</td>
              <!--<td><i class="fas fa-pencil-alt"></i></td>-->
            </tr>
          </table>

          <p v-else>Noch keine Zähler hinzugefügt.</p>
        </div>

        <div id="readings" class="shadow">
          <h2>Daten</h2>
          <br />

          <p v-if="!selectedMeter">Bitte zunächst einen Zähler auswählen.</p>

          <div v-else>
            <div class="chartContainer">
              <statistics-chart
                :selectedMeter="selectedMeter"
                :displayConsumption="true"
                :displayCost="false"
              ></statistics-chart>
            </div>
            <br />
            <div class="chartContainer" v-if="false">
              <statistics-chart
                :selectedMeter="selectedMeter"
                :displayConsumption="false"
                :displayCost="true"
              ></statistics-chart>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ButtonBar from "../elements/ButtonBar.vue";
import ContentWrapper from "./ContentWrapper.vue";
import StatisticsChart from "../elements/LineChart.js";

export default {
  name: "ContentStatistics",
  props: {},
  components: {
    ButtonBar,
    ContentWrapper,
    StatisticsChart
  },
  data() {
    let el = {
      ...this.$root.$data.sharedState,
      selectedMeter: null
    };
    el.selectedCategory = el.categories[0];
    return el;
  },

  mounted() {
    this.selectedMeter = this.meters.find(
      m => m.category == this.selectedCategory.id
    );
  },

  methods: {
    handleCategorySelected(category) {
      this.selectedMeter = null;
      this.selectedCategory = category;
    },

    getMeters() {
      return this.meters.filter(m => m.category == this.selectedCategory.id);
    },

    getReadings() {
      let returns = [];
      for (let reading of this.readings) {
        if (reading.m_uuid == this.selectedMeter.uuid) returns.push(reading);
      }
      return returns;
    },

    selectMeter(meter) {
      this.selectedMeter = meter;
    },

    getCategories() {
      return this.categories.filter(cat => cat.meterRelevant);
    }
  }
};
</script>

<style scoped>
#metersContainer {
  width: 100%;
  min-width: 30%;
  grid-row: 1;
  grid-column: 1;
  background-color: var(--c4);
  justify-self: center;
  padding: 30px;
  /*resize: horizontal;
	  overflow: auto;*/
}

#readings {
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: auto;
  justify-self: center;
  background-color: var(--c4);
  padding: 30px;
}

#abwasserNotice {
  margin-top: 30px;
}

#metersTable {
  table-layout: fixed;
}

table {
  width: 100%;
}

td {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.gridContainer {
  height: 95%;
  width: 100%;
  color: var(--ct1);

  display: grid;

  grid-template-rows: auto;
  grid-gap: 1%;
  grid-template-columns: minmax(332px, 35%) auto;
  /*grid-template-columns: 0.3fr auto;*/
}

.chartContainer {
  position: relative;
  max-width: 100%;
}

.selected {
  background-color: var(--c3) !important;
}

tr:not(:first-child):hover {
  background-color: var(--cm34);
}
</style>
