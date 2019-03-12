<template>
    <ContentWrapper id="statistics" :useInnerBox="false">

        <template #inner>
            <div id="gridContainer">
                <div id="partyCreator" class="shadow">
                    <h2>Verfügbare Parteien</h2>
                </div>

                <div id="partyDistributor" class="shadow">
                    <h2>Aufteilung</h2>
                </div>
            </div>

        </template>

    </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper.vue";
import ButtonBar from "../elements/ButtonBar.vue";

export default {
  name: "ContentParties",
  components: {ContentWrapper, ButtonBar},
  props: {},
  data() {
    let el = {
      ...this.$root.$data.sharedState
    }
    return el;
  },

  methods: {

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
</style>
