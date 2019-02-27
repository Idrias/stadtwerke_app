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
* {
  margin: 0;
  padding: 0;
}
#content {
  background-color: rgb(217, 217, 217); /*#18435A*/ /*lightgray*/
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
  background-color: #2a628f;
}

#main {
  flex: 1;
}
</style>
