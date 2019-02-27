import Vue from "vue";
import Router from "vue-router";
import ContentContracts from "./components/content_pages/ContentContracts.vue";
import ContentOverview from "./components/content_pages/ContentOverview.vue";
import ContentMeters from "./components/content_pages/ContentMeters";
import ContentStatistics from "./components/content_pages/ContentStatistics";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "overview",
      component: ContentOverview
    },
    {
      path: "/contracts",
      name: "contracts",
      component: ContentContracts
    },
    {
      path: "/meters",
      name: "meters",
      component: ContentMeters
    },
    {
      path: "/statistics",
      name: "statistics",
      component: ContentStatistics
    }
  ]
});
