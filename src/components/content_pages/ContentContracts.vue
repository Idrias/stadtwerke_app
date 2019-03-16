<template>

  <ContentWrapper id="contracts" :useInnerBox="true">
    
    <template #outer>
      <ButtonBar 
        v-bind:selectedCategory="selectedCategory" 
        v-on:categorySelected="handleCategorySelected">
      </ButtonBar>
    </template>

    <template #inner>
      <div id="grid_item">
      <table v-if="getContracts().length > 0">
        <tr>
          <th>Vertragspartner</th>
          <th>Vertragsnummer</th>
          <th>Zähler</th>
          <th>Start</th>
          <th>Ende</th>
          <th>Fixkosten</th>
          <th v-if="selectedCategory.id != 3">Variable Kosten</th>
          <th v-if="selectedCategory.id == 3">Schmutzwasser</th>
          <th v-if="selectedCategory.id == 3">Niederschlag</th>
        </tr>

        <tr
          v-for="contract in getContracts()"
          v-bind:key="contract.uuid"
          v-on:click="updateContract(contract)"
        >
          <td>{{ contract.company }}</td>
          <td>{{ contract.cid }}</td>
          <td>{{getMeter(contract.m_uuid).mid}}</td>
          <td>{{ $root.ld(contract.start) }}</td>
          <td>{{ $root.ld(contract.end) }}</td>
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
      <AddButton v-on:click="addContract()"/>
      </div>
      <AddContract
        v-on:inputDone="handleNewContract"
        v-on:deleteRequest="handleDeleteRequest"
        ref="addContract"
      />
    </template>

  </ContentWrapper>

</template>

<script>
const uuidv1 = require("uuid/v1");
import AddContract from "../dialogues/AddContract.vue";
import ButtonBar from "../elements/ButtonBar.vue";
import ContentWrapper from "./ContentWrapper.vue";
import AddButton from "../elements/AddButton.vue";

export default {
  name: "ContentContracts",
  props: {},
  components: { AddContract, ButtonBar, ContentWrapper, AddButton },
  data() {
    let el = {
      ...this.$root.$data.sharedState,
    };
    el.selectedCategory = el.categories[0];
    return el;
  },
  methods: {
    getContracts() {
      let returns = [];
      for (let cat of this.categories) {
        if (cat === this.selectedCategory) {
          for (let contract of this.contracts) {
            if (contract.category == cat.id) returns.push(contract);
          }
        }
      }
      return returns;
    },

    /* Communication with "New Contract" window */

    addContract() {
      this.$refs.addContract.openNewContract(this.selectedCategory.id);
    },

    updateContract(contract) {
      this.$refs.addContract.openForChange(contract);
    },

    handleDeleteRequest(uuid) {
      for (let index in this.contracts) {
        if (this.contracts[index].uuid == uuid) {
          this.contracts.splice(index, 1);
          break;
        }
      }
    },

    handleNewContract(contract) {
      for (let index in this.contracts) {
        if (this.contracts[index].uuid == contract.uuid) {
          contract.uuid = uuidv1();
          this.$set(this.contracts, index, { ...contract });
          return;
        }
      }
      this.contracts.push(contract);
    },

    /* Communication with button bar */
    handleCategorySelected(category) {
      this.selectedCategory = category;
    },

    getMeter(m_uuid) {
      if(m_uuid == "0") return {mid: "(alle)"}
      for(let meter of this.meters) {
        if(m_uuid == meter.uuid) return meter;
      }
      return {mid: "?"};
      
    }
  }
};
</script>

<style scoped>
</style>
