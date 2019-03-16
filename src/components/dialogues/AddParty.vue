<template>
  <DialogueWrapper :show="show" :title="title" v-on:close="close">

      <form v-on:submit.prevent>

        <!-- Informationen angeben -->
        <table>
            <tr>
                <td>Name</td>
                <td>
                    <input class="textinput" type="text" v-model="input.name" />
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
  name: "AddParty",
  components: {DialogueWrapper},
  props: {},
  data() {
    return {
      show: false,
      changeMode: false,
      title: "This is the title!",

      input: {
          name: null,
          uuid: null,
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
      for (let index in this.parties) {
        if (this.parties[index].uuid == this.input.uuid) {
          this.input.uuid = uuidv1();
          this.$set(this.parties, index, { ...this.input });
          return;
        }
      }
      this.parties.push({...this.input});

    },

    closeAndDelete() {
      this.close();
      for (let index in this.parties) {
        if (this.parties[index].uuid == this.input.uuid) {
          this.parties.splice(index, 1);
          break;
        }
      }
    },

    openNewParty(m_uuid) {
      this.title = "Neue Partei";
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }
      this.input.m_uuid = m_uuid;
      this.input.uuid = uuidv1();
      this.input.date = new Date().toISOString().substr(0, 10);
      this.show = true;
    },

    openForChange(currentVersion) {
      this.title = "Partei bearbeiten";
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    },
  }
};
</script>

<style scoped>

</style>
