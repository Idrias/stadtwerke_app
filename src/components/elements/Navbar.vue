<template>
  <div id="navbar">
    <div id="navbar-spacer"></div>

    <div
      v-for="(button, index) in this.buttons"
      v-bind:key="index"
      v-bind:class="{ selected: button.selected }"
      class="navbar-button"
      v-on:click="reroute(button)"
    >
      {{ button.name }}
    </div>
  </div>
</template>

<script>

export default {
  name: "Navbar",
  props: {},
  methods: {
    reroute(button) {
      for (let b of this.buttons) b.selected = false;
      button.selected = true;

      this.$router.push(button.route);
    }
  },

  data() {
    return {
      buttons: [
        { name: "Übersicht", route: "/", selected: true },
        { name: "Zählerstände", route: "/meters", selected: false },
        { name: "Verträge", route: "/contracts", selected: false },
        { name: "Parteien", route: "/parties", selected: false },
        { name: "Abrechnung", route: "/billing", selected: false },
        { name: "Statistik", route: "/statistics", selected: false }
      ]
    };
  }
};
</script>

<style scoped>
#navbar {
  background-color: var(--c1);
  min-height: 100%;
  height: 100%;
  width: 15%;
  float: left;
}

#navbar-spacer {
  height: 5%;
}

.navbar-button {
  background-color: var(--c2);
  text-align: center;
  height: 3%;
  padding: 12%;

  border-style: none none solid none;
  border-width: thin;

  transition: background-color 0.4s ease-in-out;
  cursor: pointer;

  display: grid;
  align-content: center;
}

.navbar-button:hover {
  background-color: var(--c2hover);
  cursor: pointer;
}

.selected {
  background-color: var(--c2high) !important;
}
</style>
