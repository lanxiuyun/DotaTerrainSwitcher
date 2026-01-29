import { createRouter, createWebHashHistory } from "vue-router";

import MapSwitcher from "@/pages/MapSwitcher.vue";
import About from "@/pages/About.vue";
import HeroAlias from "@/pages/HeroAlias.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: MapSwitcher },
    { path: "/alias", name: "alias", component: HeroAlias },
    { path: "/about", name: "about", component: About },
  ],
});

export default router;
