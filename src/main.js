import Vue from "vue";
import App from "./App.vue";
import router from "./router";
const electron = require("electron");
Vue.config.productionTip = false;

let vue = new Vue({
  render: h => h(App),
  router,
  data: {
    sharedState: {},
    colorThemes: [
      {
        name: "Dark Theme",
        inUse: true,
        colors: [
          {name: "c0", value: "#1e2124"},
          {name: "c1", value: "#282b30"},
          {name: "c2", value: "#7289da"},
          {name: "c3", value: "#36393e"},
          {name: "c4", value: "#424549"},
          {name: "cm14", value: "#2F3237"},
          {name: "cm34", value: "#3C3F44"},
          {name: "c2high", value: "#ddeaea"},
          {name: "c2hover", value: "#a8bae2"},
          {name: "ct0", value: "#2c3e50"},
          {name: "ct1", value: "lightgray"},
        ]
      },
      {
        name: "Light Theme",
        inUse: false,
        colors: [
          {name: "c0", value: "#1e2124"},
          {name: "c1", value: "#282b30"},
          {name: "c2", value: "red"},
          {name: "c3", value: "#36393e"},
          {name: "c4", value: "#424549"},
          {name: "cm14", value: "#2F3237"},
          {name: "cm34", value: "#3C3F44"},
          {name: "c2high", value: "#ddeaea"},
          {name: "c2hover", value: "#a8bae2"},
          {name: "ct0", value: "#2c3e50"},
          {name: "ct1", value: "lightgray"},
        ]
      }
    ],
  },

  methods: {
    cycleTheme() {
      for(let i in this.colorThemes) {
        i = parseInt(i);

        if(this.colorThemes[i].inUse === true) {
          this.colorThemes[i].inUse = false;
          let nextIndex = (i+1)%this.colorThemes.length;
          let nextTheme = this.colorThemes[nextIndex];

          nextTheme.inUse = true;
          for(let color of nextTheme.colors) {
            document.documentElement.style.setProperty('--'+color.name, color.value);
          };
          return;
        }
      }
    }
  },

  created: function () {
    console.log("Root Vue instance created. Now reading data.")
    let stateString = window.localStorage.getItem("applicationState")
    console.log(stateString);

    if (stateString != "null")
      this.sharedState = JSON.parse(stateString);

    else
      this.sharedState = {
        categories: [
          { id: 0, name: "Strom", unit: "kWh" },
          { id: 1, name: "Gas", unit: "kWh" },
          { id: 2, name: "Wasser", unit: "m³" },
          { id: 3, name: "Abwasser", unit: "m³" }
        ],
        contracts: [],
        meters: [],
        readings: []
      };

    console.log(this.sharedState);

  },


  watch: {
    sharedState: {
      handler(val) {
        console.log("Shared application state changed. Writing to file.")
        window.localStorage.setItem("applicationState", JSON.stringify(this.sharedState));
      },
      deep: true,
    }
  }
}).$mount("#app");

window.exportJson = function () {
  console.log(JSON.stringify(vue.$data));
}