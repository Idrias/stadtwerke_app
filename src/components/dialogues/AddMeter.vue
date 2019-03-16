<template>
  <DialogueWrapper :show="show" :title="title" v-on:close="close">
    <form v-on:submit.prevent>
      <!-- Zählerart festlegen -->
      <p>Zählerart</p>
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
        </tr>
      </table>

      <br />

      <!-- Zählerinformationen angeben -->
      <table>
        <tr>
          <td>Zählernummer</td>
          <td>
            <input class="textinput" type="text" v-model="input.mid" />
          </td>
        </tr>

        <tr>
          <td>Kommentar</td>
          <td>
            <input class="textinput" type="text" v-model="input.comment" />
          </td>
        </tr>

        <tr v-if="input.category == 2">
          <td>Verursacht Abwasser</td>
          <td><input type="checkbox" v-model="input.producesDirtyWater" /></td>
        </tr>
      </table>

      <br />
      <p v-if="!changeMode">
        Tipp: Späteres Bearbeiten des Zählers ist mit der rechten Maustaste
        möglich.
      </p>

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
  name: "AddMeter",
  components: { DialogueWrapper },
  props: {},
  data() {
    return {
      show: false,
      changeMode: false,
      title: "This is the title!",

      input: {
        mid: null,
        category: null,
        uuid: null,
        comment: null,
        producesDirtyWater: true,
        shares: {}
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

      if (this.input.category != 2) this.input.producesDirtyWater = false;

      for (let index in this.meters) {
        if (this.meters[index].uuid == this.input.uuid) {
          let uuid_old = this.input.uuid;
          let uuid_new = uuidv1();
          this.input.uuid = uuid_new;

          this.readings.forEach(reading => {
            if (reading.m_uuid == uuid_old) reading.m_uuid = uuid_new;
          });

          this.$set(this.meters, index, { ...this.input });
          this.$emit("meterChanged", {
            uuid_old: uuid_old,
            uuid_new: uuid_new
          });

          return;
        }
      }

      this.meters.push({ ...this.input });
    },

    closeAndDelete() {
      this.close();
      for (let index in this.meters) {
        if (this.meters[index].uuid == this.input.uuid) {
          this.meters.splice(index, 1);
          break;
        }
      }
      this.$emit("meterDeleted", this.input.uuid);
    },

    openNewMeter(defaultRadio) {
      this.title = "Neuer Zähler";
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }
      this.input.category = defaultRadio;
      this.input.uuid = uuidv1();
      this.input.producesDirtyWater = true;
      this.input.shares = {};
      this.show = true;
    },

    openForChange(currentVersion) {
      this.title = "Zähler bearbeiten";
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    }
  }
};
</script>

<style scoped></style>
