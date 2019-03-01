import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

let vue = new Vue({
  render: h => h(App),
  router,
  data: { 
    sharedState: {
      categories: [
        { id: 0, name: "Strom", unit: "kWh" },
        { id: 1, name: "Gas", unit: "kWh" },
        { id: 2, name: "Wasser",  unit: "m³" },
        { id: 3, name: "Abwasser", unit: "m³" }
      ],

      contracts: [
        {
          company: "Stadtwerke AG",
          cid: "1245123",
          costfix: 12,
          costvar: 12.3,
          category: 0,
          start: "01.01.2000",
          end: "31.12.9999",
          uuid: "1"
        },
        {
          company: "Stadtwerke SE",
          cid: "1245124",
          costfix: 12,
          costvar: 12.3,
          category: 0,
          start: "2000",
          end: "9999",
          uuid: "2"
        },
        {
          company: "Stadtwerke GmbH",
          cid: "1245125",
          costfix: 12,
          costvar: 12.3,
          category: 1,
          start: "2000",
          end: "9999",
          uuid: "5",
        },
        {
          company: "Stadtwerke GmbH",
          cid: "1245125",
          costfix: 12,
          costvar: 12.3,
          category: 3,
          start: "2000",
          end: "9999",
          uuid: 3
        },
        {
          company: "Stadtwerke GmbH",
          cid: "1245125",
          costfix: 12,
          costvardirty: 12.3,
          costvarrain: 1.23,
          category: 3,
          start: "2000",
          end: "9999",
          uuid: 4
        }
      ],
    } 
  }
}).$mount("#app");

window.exportJson = function() {
  console.log(JSON.stringify(vue.$data));
}