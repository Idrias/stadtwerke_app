<template>
  <DialogueWrapper :show="show" :title="title" v-on:close="close">

      <form v-on:submit.prevent>

        <!-- Informationen angeben -->
        <table>
            <tr>
                <td>Titel</td>
                <td>
                    <input class="textinput" type="text" v-model="input.name"/>
                </td>
            </tr>
        </table>

        <br>        
        <p v-if="!changeMode">Tipp: Späteres Bearbeiten der Abrechnung ist mit der rechten Maustaste möglich.</p>

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
  name: "AddBill",
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
          date: null,
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
      this.input.date = new Date().toISOString().substr(0, 10);
      for (let index in this.bills) {
        if (this.bills[index].uuid == this.input.uuid) {
          this.input.uuid = uuidv1();
          this.$set(this.bills, index, { ...this.input });
          return;
        }
      }
      this.bills.push({...this.input});

    },

    closeAndDelete() {
      this.close();
      for (let index in this.bills) {
        if (this.bills[index].uuid == this.input.uuid) {
          this.bills.splice(index, 1);
          break;
        }
      }
    },

    openNewBill(m_uuid) {
      this.title = "Neue Abrechnung";
      this.changeMode = false;

      for (let key in this.input) {
        this.input[key] = null;
      }
      this.input.m_uuid = m_uuid;
      this.input.uuid = uuidv1();
      this.show = true;
    },

    openForChange(currentVersion) {
      this.title = "Abrechnung bearbeiten";
      this.changeMode = true;
      Object.assign(this.input, currentVersion);
      this.show = true;
    },
  }
};
</script>

<style scoped>

</style>
