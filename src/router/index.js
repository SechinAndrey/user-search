import { createRouter, createWebHistory } from "vue-router";
import SearchPage from "../pages/SearchPage.vue";

const routes = [
  {
    path: "/",
    name: "search",
    component: SearchPage,
  },
  {
    path: "/user/:id-:name",
    name: "user",
    component: () => import("../pages/UserPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
