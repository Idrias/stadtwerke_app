import Vue from "vue";
import App from "./App.vue";
import router from "./router";
const electron = require("electron");
Vue.config.productionTip = false;

let vue = new Vue({
  render: h => h(App),
  router,
  data: {
    sharedState: {}
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