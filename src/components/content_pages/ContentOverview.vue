<template>
  <ContentWrapper id="overview" :useInnerBox="false">
    
    <template #inner>

        <div id="gridContainer">

          <div id="greetingContainer" class="gridContent shadow">
            <h2>
              {{getGreeting()}} <br>
              Wie kann ich Ihnen heute behilflich sein?
            </h2>
          </div>


          <div id="activeContracts" class="gridContent shadow">
            <h3>Aktive Verträge</h3>
          </div>

          <div id="expectedExpenses" class="gridContent shadow">
            <h3> Voraussichtliche Ausgaben </h3>
          </div>

          <div id="options" class="gridContent shadow">
            <h3> Optionen </h3>
            <button class="shadow"> Daten exportieren </button>
            <button class="shadow"> Daten importieren </button>
            <button class="shadow" v-on:click="$root.cycleTheme()"> Color Theme wechseln </button>
          </div>
        </div>

    </template>

  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";

export default {
  name: "ContentOverview",
  components: {ContentWrapper},
  props: {},
  methods: {
    getGreeting() {
      let hours = new Date().getHours();
      if(hours >= 3 && hours < 12) return "Guten Morgen.";
      if(hours >= 12 && hours < 18) return "Guten Tag.";
      if(hours >= 18 || hours < 3) return "Guten Abend.";
      return "Hallo.";
    }
  }
};
</script>

<style scoped>

  #gridContainer {
    display: grid;
    width: 100%; 
    height: 100%;
    grid-template-columns: 1fr 1fr 1fr;
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

  h2 {
    padding-top: 1%;
    padding-bottom: 5%;
  }
  
  button {
    width: 70%;
    height: 40px;
    margin: 10px;
    background: var(--c4);
    border: 1px solid var(--c2);
    color: var(--ct1);
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
</style>
