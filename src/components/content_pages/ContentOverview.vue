<template>
  <ContentWrapper id="overview" :useInnerBox="false">
    <template #inner>
      <div id="gridContainer">
        <div id="greetingContainer" class="gridContent shadow">
          <h2>
            {{ getGreeting() }} <br />
            {{ question }}
          </h2>
        </div>

        <div id="activeContracts" class="gridContent shadow">
          <h3>Aktive Verträge</h3>

          <table v-if="getActiveContracts().length > 0">
            <tr>
              <th>Kategorie</th>
              <th>Vertragspartner</th>
              <th>Vertragsnummer</th>
              <th>Aktiv seit</th>
            </tr>

            <tr
              v-for="contract of getActiveContracts()"
              v-bind:key="contract.uuid"
            >
              <td>{{ contract.catName }}</td>
              <td>{{ contract.company }}</td>
              <td>{{ contract.cid }}</td>
              <td>{{ $root.ld(contract.start) }}</td>
            </tr>
          </table>

          <p v-else>Keine aktiven Verträge gefunden.</p>
        </div>

        <div id="expectedExpenses" class="gridContent shadow">
          <h3>Letzte Erfassungen</h3>

          <table v-if="getLastReadings() && getLastReadings().length > 0">
            <tr>
              <th>Zähler</th>
              <th>Abgelesen</th>
              <th>Stand</th>
            </tr>

            <tr
              v-for="(reading, index) of getLastReadings()"
              v-bind:key="index"
            >
              <td>{{ reading.meter }}</td>
              <td>{{ $root.ld(reading.date) }}</td>
              <td>{{ reading.value }}</td>
            </tr>
          </table>
          <p v-else>Keine Erfassungen gefunden.</p>
        </div>

        <div id="options" class="gridContent shadow">
          <h3>Optionen</h3>
          <button class="shadow" v-on:click="exportData()">
            Daten exportieren
          </button>
          <button class="shadow" v-on:click="importData()">
            Daten importieren
          </button>

          <button class="shadow" v-on:click="$root.cycleTheme()">
            Color Theme wechseln <br />
            Aktuell: {{ $root.getThemeName() }}
          </button>
          <br />
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";
const remote = require("electron").remote;
const fs = require("fs");

export default {
  name: "ContentOverview",
  components: { ContentWrapper },
  data() {
    return {
      ...this.$root.$data.sharedState,
      question: this.getQuestion()
    };
  },
  props: {},

  methods: {
    getGreeting() {
      let hours = new Date().getHours();
      if (hours >= 3 && hours < 12) return "Guten Morgen.";
      if (hours >= 12 && hours < 18) return "Guten Tag.";
      if (hours >= 18 || hours < 3) return "Guten Abend.";
      return "Hallo.";
    },

    getQuestion() {
      let questions = [
        "Was gibt es heute zu tun?",
        "Was möchten Sie heute erledigen?",
        "Wie kann ich Ihnen heute behilflich sein?",
        "Viel Vergnügen bei der Nutzung der App!",
        "Was steht heute an?"
      ];
      return questions[parseInt(Math.random() * questions.length)];
    },

    getActiveContracts() {
      let today = new Date();
      return this.contracts
        .filter(
          contract =>
            new Date(contract.start) < today && new Date(contract.end) > today
        )
        .sort((a, b) => a.category > b.category)
        .map(
          contract =>
            (contract = {
              ...contract,
              catName: this.categories.find(cat => cat.id == contract.category)
                .name
            })
        );
    },

    getLastReadings() {
      let returns = [];
      let lastcat = null;

      let meters = [...this.meters];
      let readings = [...this.readings];
      for (let meter of meters.sort((a, b) => a.category > b.category)) {
        let res = readings
          .sort((a, b) => new Date(a.date) < new Date(b.date))
          .find(reading => reading.m_uuid == meter.uuid);
        if (res) {
          returns.push({ ...res, meter: meter.mid });
        }
      }

      return returns;
    },

    exportData() {
      let options = {
        title: "Daten exportieren",
        defaultPath: "Abrechnungsapp.backup"
      };

      let that = this;
      function then(path) {
        console.log(path);
        if (path)
          fs.writeFileSync(path, JSON.stringify(that.$root.$data.sharedState));
      }
      remote.dialog.showSaveDialog(options, then);
    },

    importData() {
      let options = {
        title: "Daten importieren",
        properties: ["openFile"]
      };

      let that = this;
      function then(filePaths) {
        if (filePaths && filePaths.length > 0) {
          let contents = fs.readFileSync(filePaths[0]);
          let sharedState = JSON.parse(contents);

          if (sharedState) {
            that.$root.$data.sharedState = sharedState;
            Object.assign(that.$data, that.$options.data.call(that));
          }
        }
      }
      remote.dialog.showOpenDialog(options, then);
    }
  }
};
</script>

<style scoped>
#gridContainer {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 3fr;
  grid-template-areas: "a a a" "b c d";
  grid-gap: 15px;
}

.gridContent {
  background: var(--c4);
  padding: 3%;
  color: var(--ct1);
}

#activeContracts {
  grid-area: b;
}

#greetingContainer {
  display: grid;
  align-content: center;
  grid-area: a;
}

#expectedExpenses {
  grid-area: c;
}

#options {
  grid-area: d;
}

button {
  width: 70%;
  min-height: 40px;
  margin: 10px;
  background: var(--c4);
  border: 1px solid var(--c2);
  color: var(--ct1);
  padding: 1px;
}

button:hover {
  cursor: pointer;
  border: 1px solid var(--c2high);
}

button:focus {
  outline: 0;
}

h3 {
  margin: 15px;
}

tr:hover {
  cursor: default;
}
</style>
