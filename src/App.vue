<template>
  
  <div id="app">
    <Handle title="Stadtwerke Verwaltungsapp"></Handle>
    
    <div id="main">
      <Navbar></Navbar>
      <div id="content">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script>
import Handle from "./components/Handle.vue";
import Navbar from "./components/Navbar.vue";

export default {
  name: "app",
  components: {
    Handle,
    Navbar,
  }
};
</script>

<style>
:root {
  --c0: black;
  --c1: #2B3A42;
  --c2: #BDD4DE;
  /*
  --c2high: rgb(146, 208, 80);
  --c2hover: rgb(168,210,151);
  */

  --c3: #3F5765;
  --c4: #FCFFF5;

  --c2high: var(--c4);
  --c2hover: #DDEAEA;
}

* {
  margin: 0;
  padding: 0;
}
#content {
  background-color: var(--c3); /*#18435A*/ /*lightgray*/
  width: 85%;
  height: 100%;
  float: left;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--c0);
}

#main {
  flex: 1;
}
</style>
