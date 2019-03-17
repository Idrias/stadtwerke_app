<template>
  <div id="app">
    <Handle title="Abrechnungsapp"></Handle>

    <div id="main">
      <Navbar></Navbar>
      <div id="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Handle from "./components/elements/Handle.vue";
import Navbar from "./components/elements/Navbar.vue";

export default {
  name: "app",
  components: {
    Handle,
    Navbar
  }
};
</script>

<style>
@import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
:root {
  --c0: #1e2124;
  --c1: #282b30;
  --c2: #7289da;

  --c3: #36393e;
  --c4: #424549;

  --cm14: #2f3237;
  --cm34: #3c3f44;

  --c2high: #ddeaea;
  --c2hover: #a8bae2;

  --ct0: #2c3e50;
  --ct1: lightgray;
  --ct2: lightgray;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  transition: background-color 0.4s ease-in-out;
}

#content {
  background-color: var(--c3); /*#18435A*/ /*lightgray*/
  width: 85%;
  height: 100%;
  float: left;
  overflow: auto;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ct0);
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--c0);
}

#main {
  flex: 1;
  overflow: auto;
}

.shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr,
td,
th {
  border-bottom: 1px solid var(--ct1);
  padding: 15px;
  margin: 0;
}

tr:not(:first-child):hover {
  background-color: var(--cm34);
  cursor: pointer;
}

/* https://codepen.io/devstreak/pen/dMYgeO */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: var(--c3);
}

::-webkit-scrollbar {
  width: 12px;
  background-color: var(--c3);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
