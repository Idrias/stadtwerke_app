<template>
  <div id="AddContract" v-if="show" v-on:click="close()">
    <div id="contractCreationWindow" class="shadow" v-on:click.stop>
      <h2 v-if="changeMode">Vertrag bearbeiten</h2>
      <h2 v-else>Neuer Vertrag</h2>
      <form v-on:submit.prevent>
        Vertragsart <br />

        <table>
          <tr>
            <td class="radiotd">
              <input
                type="radio" class="radio"
                name="kind"
                v-model.number="input.category"
                value="0"
                checked
              /><br />
              Strom
            </td>
            <td class="radiotd">
              <input
                type="radio" class="radio"
                name="kind"
                v-model.number="input.category"
                value="1"
              /><br />
              Gas
            </td>
            <td class="radiotd">
              <input
                type="radio" class="radio"
                name="kind"
                v-model.number="input.category"
                value="2"
              /><br />
              Wasser
            </td>
            <td class="radiotd">
              <input
                type="radio" class="radio"
                name="kind"
                v-model.number="input.category"
                value="3"
              /><br />
              Abwasser
            </td>
          </tr>
        </table>

        <br />

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
            <td>Fixkosten<br>(€/Jahr)</td>
            <td>
              <input class="textinput" type="text" v-model="input.costfix" />
            </td>
          </tr>


          <tr v-if="input.category == 3">
            <td>Kosten Abwasser<br>(€/{{getMeasurementUnit()}})</td>
            <td>
              <input class="textinput" type="text" v-model="input.costvardirty" />
            </td>
          </tr>
          <tr v-if="input.category == 3">
            <td>Kosten Niederschlag<br>(€/m²)</td>
            <td>
              <input class="textinput" type="text" v-model="input.costvarrain" />
            </td>
          </tr>

          <tr v-else>
            <td>Variable Kosten<br>(€/{{getMeasurementUnit()}})</td>
            <td>
              <input class="textinput" type="text" v-model="input.costvar" />
            </td>
          </tr>
        </table>

        <br />
        <div id="buttonBar">
          <button class="shadow" v-if="changeMode" v-on:click="closeAndDelete()">
            Vertrag löschen
          </button>
          <button class="shadow" v-on:click="close()">Abbrechen</button>
          <button class="shadow" v-on:click="closeAndUpdate()">Speichern</button>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
const uuidv1 = require("uuid/v1");

export default {
  name: "AddContract",
  props: {},
  data() {
    return {
      show: false,
      changeMode: false,

      input: {
        company: null,
        cid: null,
        start: null,
        end: null,
        costfix: null,
        costvar: null,
        costvarrain: null,
        costvardirty: null,
        category: null,
        uuid: null
      },
      ...this.$root.$data.sharedState,
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    closeAndUpdate() {
      this.close();
      this.$emit("inputDone", { ...this.input });
    },
    closeAndDelete() {
      this.close();
      this.$emit("deleteRequest", this.input.uuid);
    },

    openNewContract(defaultRadio) {
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }

      this.input.category = defaultRadio;
      this.input.uuid = uuidv1();
      this.show = true;
    },

    openForChange(currentVersion) {
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    },

    getMeasurementUnit() {
      for(let category of this.categories) {
        if(category.id == this.input.category) {
          return category.unit;
        }
      }
    },

  }
};
</script>

<style scoped>
#contractCreationWindow {
  width: 50%;
  
  max-height: 80%;
  background-color: var(--c3);
  color: var(--ct1);
  padding: 30px;
  box-sizing: border-box;
  margin-left: 32.5%;
  margin-top: 5%;
  overflow-y: auto;
}

#AddContract {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
}

input {
  background-color: var(--c4);
  border: none;
}

table {
  margin: 0px auto;
  width: 70%;
}

button {
  background-color: var(--c2);
  border: 0;
  width: 30%;
  height: 30px;
  margin: 8px;
}

button:hover {
  background-color: var(--c2hover);
  cursor: pointer;
}

tr,
td {
  height: 40px;
}

form {
  margin: 10px;
}

.textinput {
  height: 25px;
  width: 100%;
  color: var(--c2);
}

.radiotd {
  width: 70px;
  max-width: 70px;
}

#buttonBar {
  margin-top: 20px;
}
</style>
