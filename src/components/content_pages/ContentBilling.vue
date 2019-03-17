<template>
  <ContentWrapper id="billing" :useInnerBox="false">
    <template #inner>
      <div id="gridContainer">
        <div id="billSelectContainer" class="container shadow">
          <h2>Abrechnungsauswahl</h2>
          <br />
          <table v-if="bills.length > 0">
            <tr>
              <th>Titel</th>
              <th>Erstellt</th>
            </tr>

            <tr
              v-for="bill in bills"
              v-bind:key="bill.uuid"
              @contextmenu="$refs.addBill.openForChange(bill)"
              v-on:click="selectedBill = bill"
              v-bind:class="{ selected: selectedBill === bill }"
            >
              <td>{{ bill.name }}</td>
              <td>{{ $root.ld(bill.date) }}</td>
            </tr>
          </table>

          <p v-else>Noch keine Abrechnung hinzugefügt.</p>

          <AddButton v-on:click="$refs.addBill.openNewBill()" />
          <AddBill ref="addBill" />
        </div>

        <div id="billContainer" class="container shadow">
          <h2>Abrechnung</h2>

          <div v-if="selectedBill">
            <p>Zeitraum: {{ selectedBill.start }} - {{ selectedBill.end }}</p>
            <p>({{ getBillingDuration() }} Tage)</p>
            <br>
            <table>
              <tr>
                <th></th>
                <th>Vertrag</th>
                <th>Fixkosten</th>
                <th>Variable Kosten</th>
                <th>Gesamte Kosten</th>
              </tr>

              <tr
                v-for="(contract, index) of getAllData()"
                v-bind:key="index"
                v-bind:class="{ limitBorder: contract.categoryName != null }"
              >
                <td>{{ contract.categoryName }}</td>
                <td>
                  {{ contract.contract.cid }} <br />
                  (Zähler {{ contract.meter.mid }})
                </td>
                <td>{{ contract.fixCostPartial }} €</td>
                <td>
                  {{ contract.estimatedVariableCost }} € <br />
                  ({{ contract.estimatedConsumption }} {{ contract.unit }})
                </td>
                <td>{{ contract.costTotal }} €</td>
              </tr>
            </table>

            <h3>Gesamt</h3>
          </div>
          <p v-else><br />Bitte zunächst Abrechnung auswählen.</p>
        </div>

        <div id="settingsContainer" class="container shadow">
          <h2>Einstellungen</h2>
          <br />

          <form v-on:submit.prevent v-if="selectedBill">
            <table>
              <tr>
                <th class="noBorder" colspan="2">Abrechnungszeitraum</th>
              </tr>
              <tr>
                <td>Start</td>
                <td v-if="!selectedBill.locked">
                  <input
                    class="textinput"
                    type="date"
                    v-model="selectedBill.start"
                  />
                </td>
                <td v-else>{{ selectedBill.start }}</td>
              </tr>
              <tr>
                <td>Ende</td>
                <td v-if="!selectedBill.locked">
                  <input
                    class="textinput"
                    type="date"
                    v-model="selectedBill.end"
                  />
                </td>
                <td v-else>{{ selectedBill.end }}</td>
              </tr>

              <tr>
                <td>Abrechnung einfrieren</td>
                <td><input type="checkbox" v-model="selectedBill.locked" /></td>
              </tr>
            </table>

            <p v-if="selectedBill.locked">
              Abrechnung eingefroren: Eingaben und berechnete Were fix!
            </p>
          </form>

          <p v-else>Bitte zunächst Abrechnung auswählen.</p>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";
import AddButton from "../elements/AddButton.vue";
import AddBill from "../dialogues/AddBill.vue";

export default {
  name: "ContentBilling",
  props: {},
  components: { ContentWrapper, AddButton, AddBill },
  data() {
    let el = {
      ...this.$root.$data.sharedState,
      selectedBill: null
    };
    return el;
  },
  mounted() {
    if (this.bills.length > 0)
      this.selectedBill = this.bills[this.bills.length - 1];
  },
  computed: {},
  methods: {
    handleCategorySelected(category) {
      this.selectedCategory = category;
    },

    getBillingDuration() {
      return (
        (new Date(this.selectedBill.end) - new Date(this.selectedBill.start)) /
          (60 * 60 * 24 * 1000) +
        1
      );
    },

    getAllData() {
      if (this.selectedBill.locked) return this.selectedBill.data;
      let data = [];
      for (let category of this.categories) {
        let newData = this.getData(category.id);
        if (newData.length > 0) newData[0].categoryName = category.name;
        data = [...data, ...newData];
      }
      this.selectedBill.data = data;
      return data;
    },

    getData(category) {
      let contracts = [];
      let billingStart = new Date(this.selectedBill.start);
      let billingEnd = new Date(this.selectedBill.end);
      billingEnd.setDate(billingEnd.getDate() + 1); //TODO

      /* Get all contracts of category */

      /* Sort by beginDate & Filter: only contracts with start before billingEnd and end after billingStart */
      let filteredContracts = this.contracts
        .filter(
          contract =>
            contract.category == category &&
            new Date(contract.start) < billingEnd &&
            new Date(contract.end) > billingStart
        )
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      /* For each relevant contract */
      for (let contract of filteredContracts) {
        // Get contract duration during billing time
        let validFrom = Math.max(billingStart, new Date(contract.start));
        let validTo = Math.min(billingEnd, new Date(contract.end));
        let activeTime = validTo - validFrom;

        // Get connected meter
        let meter = this.meters.find(meter => meter.uuid == contract.m_uuid);

        // Get relevant readings
        let readings = this.readings
          .filter(reading => reading.m_uuid == meter.uuid)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // ToDo better method
        // Get average consumption
        let firstReading = readings[0];
        let lastReading = readings[readings.length - 1];
        let avgConsumption =
          (lastReading.value - firstReading.value) /
          (new Date(lastReading.date) - new Date(firstReading.date));
        // Get estimated consumption
        let estimatedConsumption = activeTime * avgConsumption;

        // Get estimated variable cost
        let estimatedVariableCost = estimatedConsumption * contract.costvar;

        // Get fix cost
        let fixCostPartial =
          (activeTime / (365 * 24 * 60 * 60 * 1000)) * contract.costfix;

        contracts.push({
          contract: contract,
          meter: meter,
          activeTime: activeTime,
          estimatedConsumption: estimatedConsumption.toFixed(2),
          estimatedVariableCost: estimatedVariableCost.toFixed(2),
          fixCostPartial: fixCostPartial.toFixed(2),
          costTotal: (fixCostPartial + estimatedVariableCost).toFixed(2),
          validTo: new Date(validTo),
          validFrom: new Date(validFrom),
          unit: this.categories[category].unit
        });
      }

      return contracts;
    }
  }
};
</script>

<style scoped>
#gridContainer {
  display: grid;
  width: 100%;
  height: 100%;

  grid-template-areas: "settings bill" "selector bill";
  grid-gap: 1%;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto auto;
}

.container {
  background: var(--c4);
  color: var(--ct1);
  padding: 30px;
  width: 100%;
  height: 100%;
  overflow: auto;
}

#billSelectContainer {
  grid-area: selector;
}

#billContainer {
  grid-area: bill;
}

#settingsContainer {
  grid-area: settings;
}

h3 {
  padding-top: 30px;
  color: var(--ct1);
}

table,
tr,
td {
  border: none;
}

.limitBorder {
  border-top: solid 1px;
}

.noBorder {
  border: none;
}

th {
  padding: 0;
  margin: 0;
}

.selected {
  background: var(--c3) !important;
}
</style>
