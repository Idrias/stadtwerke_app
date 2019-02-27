<template>
  <div id="contracts">
    <div class="shadow" id="buttonbar">
      <div
        v-for="cat in this.categories"
        v-bind:key="cat.id"
        v-on:click="buttonClick(cat.id)"
        v-bind:class="{ selected: cat.selected }"
        class="button"
        v-bind:id="cat.name"
      >
        {{ cat.name }}
      </div>
    </div>

    <div class="shadow" id="content">
      <table v-if="getContracts().length > 0">
        <tr>
          <th>Vertragspartner</th>
          <th>Vertragsnummer</th>
          <th>Start</th>
          <th>Ende</th>
          <th>Fixkosten</th>
          <th v-if="selectedCategory.id != 3">Variable Kosten</th>
          <th v-if="selectedCategory.id == 3">Kosten Schmutzwasser</th>
          <th v-if="selectedCategory.id == 3">Kosten Niederschlag</th>
        </tr>

        <tr v-for="contract in getContracts()" v-bind:key="contract">
          <td>{{ contract.company }}</td>
          <td>{{ contract.cid }}</td>
          <td>{{ contract.start }}</td>
          <td>{{ contract.end }}</td>
          <td>{{ contract.costfix }} €/Jahr</td>
          <td v-if="selectedCategory.id != 3">
            {{ contract.costvar }} €/{{ selectedCategory.unit }}
          </td>
          <td v-if="selectedCategory.id == 3">
            {{ contract.costvardirty }} €/m³
          </td>
          <td v-if="selectedCategory.id == 3">
            {{ contract.costvarrain }} €/m²
          </td>
        </tr>
      </table>

      <p v-else>Noch keine Verträge hinzugefügt.</p>

      <div id="btn_addContract" v-on:click="addContract()">+</div>
    </div>

    <AddContract v-on:inputDone="handleNewContract" ref="addContract" />
  </div>
</template>

<script>
import AddContract from "../dialogues/AddContract.vue";

let categories = [
  { id: 0, name: "Strom", selected: true, unit: "kWh" },
  { id: 1, name: "Gas", selected: false, unit: "kWh" },
  { id: 2, name: "Wasser", selected: false, unit: "m³" },
  { id: 3, name: "Abwasser", selected: false, unit: "m³" }
];

let contracts = [
  {
    company: "Stadtwerke AG",
    cid: "1245123",
    costfix: 12,
    costvar: 12.3,
    category: 0,
    start: "01.01.2000",
    end: "31.12.9999"
  },
  {
    company: "Stadtwerke SE",
    cid: "1245124",
    costfix: 12,
    costvar: 12.3,
    category: 0,
    start: "2000",
    end: "9999"
  },
  {
    company: "Stadtwerke GmbH",
    cid: "1245125",
    costfix: 12,
    costvar: 12.3,
    category: 1,
    start: "2000",
    end: "9999"
  },
  {
    company: "Stadtwerke GmbH",
    cid: "1245125",
    costfix: 12,
    costvar: 12.3,
    category: 3,
    start: "2000",
    end: "9999"
  },
  {
    company: "Stadtwerke GmbH",
    cid: "1245125",
    costfix: 12,
    costvardirty: 12.3,
    costvarrain: 1.23,
    category: 3,
    start: "2000",
    end: "9999"
  }
];

export default {
  name: "ContentContracts",
  props: {},
  components: { AddContract },
  data() {
    return {
      categories: categories,
      contracts: contracts,
      selectedCategory: categories[0]
    };
  },
  methods: {
    buttonClick(id) {
      for (let cat of this.categories) {
        if (cat.id == id) {
          cat.selected = true;
          this.selectedCategory = cat;
        } else cat.selected = false;
      }
    },

    getContracts() {
      let returns = [];
      for (let cat of this.categories) {
        if (cat.selected) {
          for (let contract of this.contracts) {
            if (contract.category == cat.id) returns.push(contract);
          }
        }
      }
      return returns;
    },

    handleNewContract(contract) {
      this.$refs.addContract.close();
      contracts.push(contract);
    },

    addContract() {
      this.$refs.addContract.open(this.selectedCategory.id);
    }
  }
};
</script>

<style scoped>
#contracts {
  width: 100%;
  height: 100%;
  padding: 2%;
  box-sizing: border-box;
}

#buttonbar {
  height: 5%;
  width: 100%;
  background-color: green;
  display: flex;
  margin-bottom: 10px;
}

#content {
  height: 95%;
  width: 100%;
  background-color: var(--c4);
  color: var(--ct1);
  padding: 3%;
  box-sizing: border-box;
}

#Abwasser {
  border-right: 0px;
}

#btn_addContract {
  margin-top: 15px;
  border: 1px solid;
  border-radius: 35%;
  width: 38px;
  height: 38px;
  display: inline-grid;
  align-content: center;
  background-color: var(--c3);
}

#btn_addContract:hover {
  background-color: var(--c4);
  cursor: pointer;
}

.button {
  width: 25%;
  float: left;
  border-right: 1px solid;
  display: grid;
  align-content: center;
  background-color: var(--c2);
  transition: background-color 0.4s ease-in-out;
}

.button:hover {
  background-color: var(--c2hover);
  cursor: pointer;
}

.selected {
  background-color: var(--c2high) !important;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr,
td,
th {
  border-bottom: 1px solid var(--ct1);
  padding: 15px;
  margin: 0;
}

tr:not(:first-child):hover {
  background-color: var(--c3);
}
</style>
