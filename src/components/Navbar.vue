<template>
  <div id="navbar">
    <div id="navbar-spacer"></div>

    <div 
      v-for="(button,index) in this.buttons" 
      v-bind:key="index" 
      v-bind:class="{selected: button.selected}"
      class="navbar-button" 
      v-on:click="reroute(button)">
        {{button.name}}
    </div>

  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {},
  methods: {
    reroute(button) {

      for(let b of this.buttons) b.selected = false;
      button.selected = true;

      this.$router.push(button.route);
    }
  },

  data() {
    return({
      buttons: [
        {name: "Übersicht", route: "/", selected: true},
        {name: "Verträge", route: "/contracts", selected: false},
        {name: "Zählerstände", route: "/meters", selected: false},
        {name: "Statistiken", route: "/statistics", selected: false},
      ]
    })
  }

};
</script>

<style scoped>
#navbar {
  background-color: #16324f;
  min-height: 100%;
  height: 100%;
  width: 15%;
  float: left;
}

#navbar-spacer {
  height: 5%;
}

.navbar-button {
  background-color: #70ad47;
  text-align: center;
  height: 3%;
  padding: 8%;


  border-style: none none solid none;
  border-width: thin;

  transition: background-color .4s ease-in-out;
  cursor: pointer;

  display: grid;
  align-content: center;
}

.navbar-button:hover {
  background-color: rgb(146, 208, 80);
  cursor: pointer;
}

.selected {
  background-color: rgb(155, 236, 68) !important; 
}
</style>
