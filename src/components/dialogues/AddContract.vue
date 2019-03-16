<template>
  <DialogueWrapper :show="show" :title="title" v-on:close="close">
    <form v-on:submit.prevent>
      <!-- Vertragsart festlegen -->
      <p>Vertragsart</p>
      <table>
        <tr>
          <td class="radiotd">
            <input
              type="radio"
              class="radio"
              name="kind"
              v-model.number="input.category"
              value="0"
              checked
            /><br />
            Strom
          </td>
          <td class="radiotd">
            <input
              type="radio"
              class="radio"
              name="kind"
              v-model.number="input.category"
              value="1"
            /><br />
            Gas
          </td>
          <td class="radiotd">
            <input
              type="radio"
              class="radio"
              name="kind"
              v-model.number="input.category"
              value="2"
            /><br />
            Wasser
          </td>
          <td class="radiotd">
            <input
              type="radio"
              class="radio"
              name="kind"
              v-model.number="input.category"
              value="3"
            /><br />
            Abwasser
          </td>
        </tr>
      </table>

      <br />

      <!-- Vertragsinformationen angeben -->
      <table>
        <tr>
          <td>Vertragspartner</td>
          <td>
            <input class="textinput" type="text" v-model="input.company" />
          </td>
        </tr>

        <tr>
          <td>Vertragsnummer</td>
          <td><input class="textinput" type="text" v-model="input.cid" /></td>
        </tr>

        <tr>
          <td>Zähler</td>
          <td>
            <select v-model="input.m_uuid" v-if="getMeters().length > 0">
              <option
                v-for="meter in getMeters()"
                v-bind:key="meter.uuid"
                v-bind:value="meter.uuid"
              >
                {{ meter.mid }}
              </option>
            </select>
            <p v-else>Keine passenden Zähler gefunden!</p>
          </td>
        </tr>

        <tr>
          <td>Start</td>
          <td>
            <input class="textinput" type="date" v-model="input.start" />
          </td>
        </tr>

        <tr>
          <td>Ende</td>
          <td><input class="textinput" type="date" v-model="input.end" /></td>
        </tr>

        <tr>
          <td>Fixkosten<br />(€/Jahr)</td>
          <td>
            <input class="textinput" type="text" v-model="input.costfix" />
          </td>
        </tr>

        <tr v-if="input.category == 3">
          <td>Kosten Abwasser<br />(€/{{ getMeasurementUnit() }})</td>
          <td>
            <input class="textinput" type="text" v-model="input.costvardirty" />
          </td>
        </tr>
        <tr v-if="input.category == 3">
          <td>Kosten Niederschlag<br />(€/m²)</td>
          <td>
            <input class="textinput" type="text" v-model="input.costvarrain" />
          </td>
        </tr>
        <tr v-if="input.category == 3">
          <td>Grundstücksgröße<br />(m²)</td>
          <td>
            <input class="textinput" type="text" v-model="input.costvararea" />
          </td>
        </tr>

        <tr v-else>
          <td>Variable Kosten<br />(€/{{ getMeasurementUnit() }})</td>
          <td>
            <input class="textinput" type="text" v-model="input.costvar" />
          </td>
        </tr>
      </table>

      <br />

      <!-- Buttons -->
      <div id="buttonBar">
        <button class="shadow" v-if="changeMode" v-on:click="closeAndDelete()">
          Löschen
        </button>
        <button class="shadow" v-on:click="close()">Abbrechen</button>
        <button class="shadow" v-on:click="closeAndUpdate()">Speichern</button>
      </div>
    </form>
  </DialogueWrapper>
</template>

<script>
const uuidv1 = require("uuid/v1");
import DialogueWrapper from "./DialogueWrapper.vue";

export default {
  name: "AddContract",
  components: { DialogueWrapper },
  props: {},
  data() {
    return {
      show: false,
      changeMode: false,
      title: "This is the title!",

      input: {
        company: null,
        cid: null,
        start: null,
        end: null,
        costfix: null,
        costvar: null,
        costvarrain: null,
        costvardirty: null,
        costvararea: null,
        category: null,
        uuid: null,
        m_uuid: null
      },
      ...this.$root.$data.sharedState
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    closeAndUpdate() {
      this.close();

      if (this.input.end == null) this.input.end = "9999-12-31";

      this.$emit("inputDone", { ...this.input });
    },
    closeAndDelete() {
      this.close();
      this.$emit("deleteRequest", this.input.uuid);
    },

    openNewContract(defaultRadio) {
      this.title = "Neuer Vertrag";
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }

      this.input.end = "9999-12-31";
      this.input.category = defaultRadio;
      this.input.uuid = uuidv1();
      this.show = true;
    },

    openForChange(currentVersion) {
      this.title = "Vertrag bearbeiten";
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    },

    getMeasurementUnit() {
      for (let category of this.categories) {
        if (category.id == this.input.category) {
          return category.unit;
        }
      }
    },

    getMeters() {
      let returns = [];
      for (let meter of this.meters) {
        if (meter.category == this.input.category) {
          returns.push(meter);
        }
      }
      return returns;
    }
  }
};
</script>

<style scoped></style>
