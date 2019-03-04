<template>
  <DialogueWrapper :show="show" :title="title" v-on:close="close">

      <form v-on:submit.prevent>

        <!-- Zählerinformationen angeben -->
        <table>
            <tr>
                <td>Zählerstand</td>
                <td>
                    <input class="textinput" type="text" v-model="input.value" />
                </td>
            </tr>

            <tr>
                <td>Ablesedatum</td>
                <td>
                    <input class="textinput" type="date" v-model="input.date" />
                </td>
            </tr>

            <tr>
                <td>Kommentar</td>
                <td>
                    <input class="textinput" type="text" v-model="input.comment" />
                </td>
            </tr>
        </table>

        <br>        

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
  name: "AddReading",
  components: {DialogueWrapper},
  props: {},
  data() {
    return {
      show: false,
      changeMode: false,
      title: "This is the title!",

      input: {
        date: null,
        value: null,
        uuid: null,
        comment: null,
        m_uuid: null,
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
      for (let index in this.readings) {
        if (this.readings[index].uuid == this.input.uuid) {
          this.input.uuid = uuidv1();
          this.$set(this.readings, index, { ...this.input });
          return;
        }
      }
      this.readings.push({...this.input});
    },

    closeAndDelete() {
      this.close();
      for (let index in this.readings) {
        if (this.readings[index].uuid == this.input.uuid) {
          this.readings.splice(index, 1);
          break;
        }
      }
    },

    openNewReading(m_uuid) {
      this.title = "Neue Ablesung";
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }
      this.input.m_uuid = m_uuid;
      this.input.uuid = uuidv1();
      this.show = true;
    },

    openForChange(currentVersion) {
      this.title = "Ablesung bearbeiten";
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    },
  }
};
</script>

<style scoped>

</style>
