<template>
  <div id="AddContract" v-if="show" v-on:click="close()">
    <div id="contractCreationWindow" class="shadow" v-on:click.stop>
      <h2>Neuer Vertrag</h2>
      <form v-on:submit.prevent>
        Vertragsart <br />

        <table>
          <tr>
            <td class="radiotd">
              <input
                type="radio"
                name="kind"
                v-model.number="inputKind"
                value="0"
                checked
              />
              Strom
            </td>
            <td class="radiotd">
              <input
                type="radio"
                name="kind"
                v-model.number="inputKind"
                value="1"
              />
              Gas
            </td>
            <td class="radiotd">
              <input
                type="radio"
                name="kind"
                v-model.number="inputKind"
                value="2"
              />
              Wasser
            </td>
            <td class="radiotd">
              <input
                type="radio"
                name="kind"
                v-model.number="inputKind"
                value="3"
              />
              Abwasser
            </td>
          </tr>
        </table>

        <br />

        <table>
          <tr>
            <td>Vertragspartner</td>
            <td>
              <input class="textinput" type="text" v-model="inputCompany" />
            </td>
          </tr>

          <tr>
            <td>Vertragsnummer</td>
            <td><input class="textinput" type="text" v-model="inputCid" /></td>
          </tr>

          <tr>
            <td>Start</td>
            <td>
              <input class="textinput" type="date" v-model="inputStart" />
            </td>
          </tr>

          <tr>
            <td>Ende</td>
            <td><input class="textinput" type="date" v-model="inputEnd" /></td>
          </tr>

          <tr>
            <td>Fixkosten</td>
            <td>
              <input class="textinput" type="text" v-model="inputCostfix" />
            </td>
          </tr>

          <tr>
            <td>Variable Kosten</td>
            <td>
              <input
                class="textinput"
                type="text"
                v-model="inputCostvariable"
              />
            </td>
          </tr>
        </table>

        <br />
        <button class="shadow" v-on:click="close()">Verwerfen</button>
        <button
          class="shadow"
          v-on:click="$emit('inputDone', getNewContract())"
        >
          Hinzufügen
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddContract",
  props: {},
  data() {
    return {
      show: false,
      inputKind: 0
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    open(defaultRadio) {
      console.log(defaultRadio);
      this.inputKind = defaultRadio;
      this.show = true;
    },
    getNewContract() {
      return {
        company: this.inputCompany,
        cid: this.inputCid,
        start: this.inputStart,
        end: this.inputEnd,
        costfix: this.inputCostfix,
        costvar: this.inputCostvariable,
        category: this.inputKind
      };
    }
  }
};
</script>

<style scoped>
#contractCreationWindow {
  width: 50%;
  height: 70%;
  background-color: var(--c3);
  color: var(--ct1);
  padding: 30px;
  box-sizing: border-box;
  margin-left: 32.5%;
  margin-top: 7.5%;
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
  margin-top: 20px;
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
}

.radiotd {
  width: 70px;
  max-width: 70px;
}
</style>
