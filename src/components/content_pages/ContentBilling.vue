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
            <div v-if="getAllData() && getAllData().length > 0">
              <p>Zeitraum: {{ selectedBill.start }} - {{ selectedBill.end }}</p>
              <p>({{ getBillingDuration() }} Tage)</p>
              <br />

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
                    {{ contract.contract.cid }}
                    <br />
                    (Zähler {{ contract.meter.mid }})
                  </td>
                  <td>{{ contract.fixCostPartial }} €</td>
                  <td>
                    {{ contract.estimatedVariableCost }} €
                    <br />
                    ({{ contract.estimatedConsumption }} {{ contract.unit }})
                  </td>
                  <td>
                    {{ contract.costTotal }} €
                    <br />
                    {{ partyByUuid(selectedBill.party).name }}:
                    {{ (contract.costTotal * contract.partyShare).toFixed(2) }}€
                    ({{ contract.partyShare * 100 }}%)
                  </td>
                </tr>
              </table>

              <h3>
                {{ getSum(getAllData()) }}
                <br />
                {{ getSumParty(getAllData()) }}
              </h3>
            </div>
          </div>
          <p v-else><br />Bitte zunächst Abrechnung auswählen.</p>

          <br />
          <div v-for="(error, index) of getErrors()" v-bind:key="index">
            <p style="color: var(--c2)">{{ error }}</p>
            <br />
          </div>
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
                <td v-else>{{ $root.ld(selectedBill.start) }}</td>
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
                <td v-else>{{ $root.ld(selectedBill.end) }}</td>
              </tr>

              <tr>
                <td>Partei</td>
                <td v-if="!selectedBill.locked">
                  <select v-model="selectedBill.party">
                    <option
                      v-for="party of parties"
                      v-bind:key="party.uuid"
                      v-bind:value="party.uuid"
                      >{{ party.name }}</option
                    >
                    <option value="alle">Alle</option>
                  </select>
                </td>
                <td v-else>
                  {{
                    partyByUuid(selectedBill.party)
                      ? partyByUuid(selectedBill.party).name
                      : "Unbekannt"
                  }}
                </td>
              </tr>

              <tr>
                <td>Abrechnung einfrieren</td>
                <td>
                  <input type="checkbox" v-model="selectedBill.locked" />
                </td>
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
import { Menu } from "electron";

let temp = [];

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
    getSum(contracts) {
      let sum = 0;
      for (let c of contracts) {
        sum += parseFloat(c.costTotal);
      }
      return "Summe: " + sum.toFixed(2) + "€";
    },

    getSumParty(contracts) {
      let sumParty = 0;
      for (let c of contracts) {
        sumParty += parseFloat(c.costTotal * c.partyShare);
      }
      return (
        this.partyByUuid(this.selectedBill.party).name +
        ": " +
        sumParty.toFixed(2) +
        "€"
      );
    },

    partyByUuid(uuid) {
      if (uuid == "alle") return { name: "Alle" };
      return this.parties.find(party => party.uuid == uuid);
    },

    getErrors() {
      return temp;
    },

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
      temp = [];
      if (
        !this.selectedBill.party ||
        !this.selectedBill.start ||
        !this.selectedBill.end
      ) {
        temp.push("Achtung: Einstellungen unvollständig.");
        return;
      }

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
        if (!meter) {
          temp.push(
            "Achtung: Für Vertrag " +
              contract.cid +
              " muss ein Zähler angegeben werden, damit dieser aufgenommen werden kann."
          );
          continue;
        }

        // Get relevant readings
        let readings = this.readings
          .filter(reading => reading.m_uuid == meter.uuid)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (!readings || readings.length < 2) {
          temp.push(
            "Achtung: Zähler " +
              meter.mid +
              " benötigt mindestens zwei Erfassungen, damit Vertrag " +
              contract.cid +
              " aufgenommen werden kann."
          );
          continue;
        }
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
        let estimatedVariableCost;
        if (category != 3)
          estimatedVariableCost = estimatedConsumption * contract.costvar;
        else
          estimatedVariableCost =
            estimatedConsumption * contract.costvardirty +
            contract.costvararea * contract.costvarrain;

        // Get fix cost
        let fixCostPartial =
          (activeTime / (365 * 24 * 60 * 60 * 1000)) * contract.costfix;

        let sumShares = 0;
        for (let index in meter.shares) {
          sumShares += meter.shares[index];
        }
        let partyShare = meter.shares[this.selectedBill.party] / sumShares;
        if (!partyShare) partyShare = 0;
        if (this.selectedBill.party == "alle") partyShare = 1;

        contracts.push({
          contract: contract,
          meter: meter,
          activeTime: activeTime,
          estimatedConsumption: estimatedConsumption.toFixed(2),
          estimatedVariableCost: estimatedVariableCost.toFixed(2),
          fixCostPartial: fixCostPartial.toFixed(2),
          costTotal: (fixCostPartial + estimatedVariableCost).toFixed(2),
          partyShare: partyShare.toFixed(4),
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

select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 25px;
  color: var(--c2);
  background-color: var(--c3);
}

select::-ms-expand {
  display: none;
}
</style>
