import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import colorThemes from "./assets/themes.js";
Vue.config.productionTip = false;

let vue = new Vue({
  render: h => h(App),
  router,
  data: {
    sharedState: {},
  },

  methods: {
    applyTheme(nextTheme) {
      for (let color of nextTheme.colors) {
        document.documentElement.style.setProperty(
          "--" + color.name,
          color.value
        );
      }
    },

    cycleTheme() {
      this.sharedState.activeThemeIndex = (this.sharedState.activeThemeIndex + 1) % colorThemes.length;
      let nextTheme = colorThemes[this.sharedState.activeThemeIndex];
      this.applyTheme(nextTheme);
    },

    getThemeName() {
      return colorThemes[this.sharedState.activeThemeIndex].name;
    },

    getCssVar(name) {
      return window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(name);
    },

    ld(date, locale) {
      if (locale) return new Date(date).toLocaleDateString(locale);
      else return new Date(date).toLocaleDateString("de-de");
    }
  },

  created: function() {
    console.log("Root Vue instance created. Now reading data.");
    let stateString = window.localStorage.getItem("applicationState");

    if (stateString != "null") this.sharedState = JSON.parse(stateString);

    if (stateString == "null" || this.sharedState == {})
      this.sharedState = {
        categories: [
          { id: 0, name: "Strom", unit: "kWh", meterRelevant: true },
          { id: 1, name: "Gas", unit: "kWh", meterRelevant: true },
          { id: 2, name: "Wasser", unit: "m³", meterRelevant: true },
          { id: 3, name: "Abwasser", unit: "m³", meterRelevant: false }
        ],
        contracts: [],
        meters: [],
        readings: [],
        parties: [],
        bills: [],
        activeThemeIndex: 0,
      };

      this.applyTheme(colorThemes[this.sharedState.activeThemeIndex]);
  },

  watch: {
    sharedState: {
      handler(val) {
        console.log("Shared application state changed. Writing to file.");
        window.localStorage.setItem(
          "applicationState",
          JSON.stringify(this.sharedState)
        );
      },
      deep: true
    }
  }
}).$mount("#app");
