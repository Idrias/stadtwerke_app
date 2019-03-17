<template>
  <div class="handle">
    <div id="titleContainer">
      {{ title }}
    </div>

    <div id="controlContainer">
      <div class="nodrag">
        <div class="cntrl" id="close" v-on:click="close">🞩</div>
        <div class="cntrl" v-on:click="maximize">▢</div>
        <div class="cntrl" v-on:click="minimize">┈</div>
      </div>
    </div>
  </div>
</template>

<script>
const remote = require("electron").remote;

export default {
  name: "Handle",
  props: {
    title: String
  },
  methods: {
    close() {
      remote.getCurrentWindow().close();
    },

    maximize() {
      remote.getCurrentWindow().maximize();
    },

    minimize() {
      remote.getCurrentWindow().minimize();
    }
  }
};
</script>

<style scoped>
.handle {
  width: calc(100%-4px);
  margin: 2px 2px 0 2px;
  height: 30px;
  line-height: 30px;
  background: var(--c0);
  font-size: 15px;
  color: lightgray;
  -webkit-app-region: drag;
  text-align: center;
  font-family: "Nunito", sans-serif;
  padding: 2px;

  display: grid;
  grid-template-columns: 1fr, 1fr, 1fr;
  grid-template-rows: auto;
  grid-template-areas: "l m r";
}

#controlContainer {
  text-align: right;
  align-content: right;
  grid-area: r;
}

#titleContainer {
  grid-area: m;
  text-align: center;
  padding-left: 50px;
}

.cntrl {
  float: right;
  padding-left: 15px;
  padding-right: 15px;
}

.cntrl:hover {
  background: var(--c2);
}

.nodrag {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0px;
  right: 6px;
}

#close:hover {
  background: red;
}
</style>
