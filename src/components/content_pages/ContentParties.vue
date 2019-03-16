<template>
    <ContentWrapper id="statistics" :useInnerBox="false">

        <template #inner>
            <div id="gridContainer">
                <div id="partyCreator" class="shadow">
                    <h2>Verfügbare Parteien</h2>
                    <table v-if="parties.length > 0">
                        <tr>
                            <th> Partei </th>
                        </tr>
                        <tr v-for="party in parties" v-bind:key="party.uuid" v-on:click="$refs.addParty.openForChange(party)"><td>{{party.name}}</td></tr> 
                    </table>
                    <p v-else>Noch keine Partei angelegt.</p>

                    <AddButton v-on:click="$refs.addParty.openNewParty()"></AddButton>
                    <AddParty ref="addParty"></AddParty>
                    

                </div>

                <div id="partyDistributor" class="shadow">
                    <h2>Aufteilung</h2>

                    <div v-if="parties.length > 0">
                        <div v-for="meter of meters" v-bind:key="meter.uuid">
                            <table>
                                <tr>
                                    <td colspan="3"><h3>{{meter.mid}} {{meter.comment ? "("+meter.comment+")" : ""}}</h3></td>
                                </tr>
                                <tr v-for="party in parties" v-bind:key="party.uuid" class="notClickable">
                                    <td>Anteile {{party.name}}</td>
                                    <td><input type="number" v-model.number="meter.shares[party.uuid]" min="0"/></td><td>({{getPercentage(meter, party)}}%)</td>
                                </tr>
                            </table>
                            <br/>
                        </div>
                    </div>
                    <p v-else>Bitte zunächst mindestens eine Partei anlegen.</p>
                </div>
            </div>

        </template>

    </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";
import ButtonBar from "../elements/ButtonBar.vue";
import AddButton from "../elements/AddButton.vue";
import AddParty from "../dialogues/AddParty.vue";

export default {
  name: "ContentParties",
  components: {ContentWrapper, ButtonBar, AddButton, AddParty},
  props: {},
  data() {
    let el = {
      ...this.$root.$data.sharedState,
    }
    return el;
  },

  methods: {
      getPercentage(meter, party) {
          let sum = 0;
          for(let share in meter.shares) {
              if( this.parties.find(p => p.uuid == share) )
              sum += meter.shares[share];
          }

          return ((meter.shares[party.uuid] / sum)*100).toFixed(2);
      }

  },


};

</script>

<style scoped>
    #gridContainer {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 1%;
        grid-template-areas: "a b"
    }

    #partyCreator {
        grid-area: a;
        background: var(--c4);
        padding: 3%;
        color: var(--ct1);
    }

    #partyDistributor {
        grid-area: b;
        background: var(--c4);
        padding: 3%;
        color: var(--ct1);
    }

    table, tr, td {
        border: none;
        padding: 1%;
    }

    table {
        table-layout: initial;
    }


    h2 {
        margin-bottom: 20px;
    }

    .notClickable:hover {
        cursor: default;
    }
</style>
